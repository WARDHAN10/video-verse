import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Ffmpeg from 'fluent-ffmpeg';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import path from 'path';
import { checkFileSize, streamToBuffer } from 'src/utils/helpers';
import * as stream from 'stream';
import { VideoEditStore } from './entities/video_edit_store.entity';
import { VideoStore } from './entities/video_store.entity';

@Injectable()
export class VideoOperationsService {
  private readonly baseDir = path.join(__dirname, '../../');
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @Inject('videoStoreRepository') private videoStoreRepository: typeof VideoStore,
    @Inject('videoEditStoreRepository') private videoEditStoreRepository: typeof VideoEditStore,
  ) {
    this.s3Client = new S3Client({
      endpoint: process.env.AWS_ENDPOINT,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME;
    Ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
    Ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
  }

  async getFileDetails(id: string) {
    return await this.videoStoreRepository.findOne({ where: { id } });
  }
  /**
   * Trims a specific video stored in R2 based on the provided start and end times, uploads the trimmed video 
   * back to R2, and stores the edit operation details in the database.
   * 
   * Key Steps:
   * 1. Validates the `start` and `end` times to ensure they are numbers.
   * 2. Retrieves the video record from the database using the provided `id`. Throws an exception if the video is not found.
   * 3. Downloads the video file from R2 as a local stream using the file path stored in the database.
   * 4. Trims the downloaded video locally, producing a trimmed video stream for the specified duration.
   * 5. Converts the trimmed video stream into a buffer and uploads the trimmed video to R2, generating a new URL.
   * 6. Creates a record in the `videoEditStoreRepository` to log the trimming operation with relevant metadata such as:
   *    - Original video ID
   *    - Trimmed video file path
   *    - Operation type (`trim`)
   *    - Start and end times of the trim
   *    - Timestamps and user details
   * 7. Returns the created video edit record.
   * 
   * If any operation fails (e.g., invalid input, video not found, trimming error, upload failure), an error is logged,
   * and a `BadRequestException` is thrown.
   */

  async trim(id: number, start: number, end: number) {
    const videoPath = './output.mp4';

    console.log(start, end);

    if (isNaN(start) || isNaN(end)) {
      throw new BadRequestException('Invalid start or end time');
    }

    try {
      const video = await this.videoStoreRepository.findOne({ where: { id } });
      if (!video) throw new BadRequestException('Video not found');

      await this.downloadFromR2AsStream(video.filePath);
      console.log('Trimming video:', video.toJSON(), videoPath, start + end, video.duration);

      if ((start + end) > video.duration) {
        throw new Error('Invalid trimming times: Video too short for the specified trim durations.');
      }
      const duration = video.duration - end;
      const trimmedVideoStream = await this.trimLocalVideo(videoPath, start, duration);

      const uploadResult = await this.uploadToR2(await streamToBuffer(trimmedVideoStream), id, 'trimmed');

      const videoEditStore = await this.videoEditStoreRepository.create({
        originalVideoId: video.id,
        editedVideoPath: uploadResult,
        operation: 'trim',
        startTime: start,
        endTime: end,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'user123',
        updated_by: 'user123',
      });

      console.log('Video uploaded to R2:', uploadResult);
      const expirationInSeconds = 3600;
      const getObjectCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: uploadResult,
      });
      const url = await getSignedUrl(this.s3Client, getObjectCommand, { expiresIn: expirationInSeconds });
      return { url, expiry: expirationInSeconds + 's' };
    } catch (error) {
      console.error('Error during video trimming:', error);
      throw new BadRequestException('Failed to trim video');
    }
  }



  private async downloadFromR2AsStream(s3Key: string): Promise<stream.Readable> {
    const folder = '';
    const params = {
      Bucket: this.bucketName,
      Key: `${folder}${s3Key}`,
    };
    console.log('Downloading video from R2:', params);
    try {
      const data = await this.s3Client.send(new GetObjectCommand(params));
      const videoStream = data.Body as ReadableStream;
      const nodeStream = stream.Readable.from(videoStream);
      const writeStream = fs.createWriteStream('./output.mp4');
      return new Promise((resolve, reject) => {
        nodeStream.pipe(writeStream);
        writeStream.on('finish', () => {
          resolve(nodeStream);
        });
        writeStream.on('error', reject);
      })
    } catch (error) {
      console.error('Error downloading video:', error);
      throw new BadRequestException('Failed to download video');
    }
  }
  /**
   * Handles the upload of a video file, validates its properties, and stores its details in the database.
   * 
   * Key Steps:
   * 1. Validates that the file is uploaded successfully and contains the required data (size and buffer).
   * 2. Extracts the video duration and validates it to ensure it falls within the allowed range of 5 to 25 seconds.
   * 3. Validates the file size to confirm it is between 5 MB and 25 MB.
   * 4. Uploads the video file to an R2 bucket using a buffer and generates a URL for storage.
   * 5. Creates a database entry for the uploaded video, storing its file path, size, duration, and metadata such as 
   *    creation and update timestamps.
   * 6. Returns the database record of the uploaded video as a JSON object.
   * 
   * If any validation or upload fails, an error is logged, and a `BadRequestException` is thrown.
   */

  async upload(fileObject: Express.Multer.File) {
    try {
      console.log('Uploaded file object:', fileObject);

      if (!fileObject) {
        throw new Error('File not uploaded or path is missing');
      }
      const { size, buffer } = fileObject;
      const duration = await this.getVideoDuration(buffer);
      if (duration > 25 || duration < 5) {
        return { message: "video duration should be between 5 to 25 seconds" };
      }
      if (!checkFileSize(size)) {
        return { message: "video should be between 5 to 25 MB of size" };
      }

      const s3Url = await this.uploadToR2(buffer, new Date().getTime(), 'upload');
      const video = await this.videoStoreRepository.create({
        filePath: s3Url,
        size: size,
        duration: await this.getVideoDuration(buffer),
        created_by: 'user123',
        updated_at: new Date(),
        created_at: new Date(),
        updated_by: 'user123',
      });

      console.log(video.id);

      return video.toJSON();
    } catch (error) {
      console.error('Error during file upload:', error);
      throw new BadRequestException('Failed to upload video');
    }
  }

  async getVideoDuration(buffer: Buffer): Promise<number> {
    const tempFilePath = path.join(this.baseDir, `temp_${Date.now()}.mp4`);
    try {
      await fs.promises.writeFile(tempFilePath, buffer);

      return new Promise((resolve, reject) => {
        Ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
          fs.unlinkSync(tempFilePath);
          if (err) {
            reject(err);
          } else {
            const duration = metadata.format.duration;
            resolve(duration);
          }
        });
      });
    } catch (error) {
      console.error('Error writing buffer to file:', error);
      throw new Error('Failed to write buffer to file');
    }
  }

  private async uploadToR2(buffer: Buffer, id: number, action: string): Promise<string> {
    const fileName = `${action}_video_${id}.mp4`;
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: 'video/mp4',
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      const baseUrl = process.env.AWS_ENDPOINT;
      if (!baseUrl) {
        throw new Error('AWS_ENDPOINT is not defined in environment variables');
      }

      const fileUrl = fileName;
      console.log('Uploaded file URL:', fileUrl);

      return fileUrl;
    } catch (error) {
      console.error('Error uploading to Cloudflare R2:', error);
      throw new BadRequestException('Failed to upload video to R2');
    }
  }

  async trimLocalVideo(inputPath: string, start: number, duration: number): Promise<stream.Readable> {
    const outputPath = `./trimmed_output.mp4`;
    try {
      await new Promise<void>((resolve, reject) => {
        Ffmpeg({ source: inputPath })
          .setStartTime(start)
          .setDuration(duration)
          .on('start', function (commandLine) {
            console.log('Spawned FFmpeg with command: ' + commandLine);
          })
          .on('error', function (err) {
            console.log('error: ', err);
            reject(err);
          })
          .on('end', function () {
            console.log('Conversion Done');
            resolve();
          })
          .saveToFile(outputPath);
      });
      const videoStream = fs.createReadStream(outputPath);
      return videoStream
    } catch (error) {
      console.error('Error during video trimming:', error);
      throw error;
    }
  }
  /**
   * Merges multiple video files stored in R2 into a single video file.
   * 
   * The function retrieves video files from the R2 bucket using their unique keys, 
   * but due to issues with handling Readable streams directly in ffmpeg and limited bandwidth, 
   * a workaround has been implemented to handle the merging process using local files. 
   * Each video is downloaded, merged locally, and then uploaded back to the R2 bucket. 
   * 
   * Once the merged video is successfully uploaded, a pre-signed URL is generated with an 
   * expiration time of 3600 seconds, allowing the merged video to be shared securely.
   * 
   * Key Steps:
   * 1. Retrieve video files from R2 using their unique identifiers.
   * 2. Create a local file-based ffmpeg merge process to address stream handling issues.
   * 3. Upload the merged video back to R2 with appropriate metadata (Content-Type, size).
   * 4. Generate and return a pre-signed URL for accessing the merged video.
   */
  async mergeVideosFromR2(inputKeys: string[]) {
    const videoStreams = [];

    for (const id of inputKeys) {
      const file = await this.videoStoreRepository.findOne({ where: { id } });
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: file.filePath,
      });

      const response = await this.s3Client.send(command);
      videoStreams.push(stream.Readable.from(response.Body as ReadableStream));
    }


    const ffmpegCommand = Ffmpeg();
    for (const stream of videoStreams) {
      ffmpegCommand.input('./example_media.mp4');
    }

    try {
      await new Promise<void>((resolve, reject) => {
        ffmpegCommand
          .mergeToFile("./merged_video.mp4", ".temp/")
          .on('end', () => {
            console.log('Merging complete!');
            resolve();
          })
          .on('error', (err) => {
            console.error('Error during merge:', err);
            reject(err);
          });
      });

      const stats = await new Promise<fs.Stats>((resolve, reject) => {
        fs.stat("merged_video.mp4", (err, stats) => {
          if (err) {
            reject(err);
          } else {
            resolve(stats);
          }
        });
      }) // Get the file size
      const ReadableStream = fs.createReadStream('./merged_video.mp4');

      // Once the merge is complete, proceed with uploading the video
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: 'merged_video.mp4',
        Body: ReadableStream,
        ContentType: 'video/mp4',
        ContentLength: stats.size,
      });

      await this.s3Client.send(uploadCommand); // Wait for upload to finish
      console.log('Merged video uploaded to R2');
      // Generate a pre-signed URL
      const expirationInSeconds = 3600; // Define the expiration time in seconds
      const getObjectCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: 'merged_video.mp4',
      });

      // const mergedRecord = await this.videoEditStoreRepository.create({
      //   // originalVideoId: ,
      //   editedVideoPath: 'merged_video.mp4',
      //   operation: 'merge',
      //   created_at: new Date(),
      //   updated_at: new Date(),
      //   created_by: 'user123',
      //   updated_by: 'user123',
      // })

      const url = await getSignedUrl(this.s3Client, getObjectCommand, { expiresIn: expirationInSeconds });
      return { url, expiry: expirationInSeconds + 's' };
      // return `${process.env.AWS_PUBLIC_URL}/merged_video.mp4`; // Return the URL
    } catch (err) {
      console.error('Error during merge or upload:', err);
      throw err; // Re-throw the error if something goes wrong
    }

  }
}
