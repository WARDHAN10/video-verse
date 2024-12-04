import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import path from 'path';
import { CreateVideoOperationDto } from './dto/create-video_operation.dto';
import { VideoEditStore } from './entities/video_edit_store.entity';
import { VideoStore } from './entities/video_store.entity';

@Injectable()
export class VideoOperationsService {
  private readonly baseDir = path.join(__dirname, '../../assets/videos'); // This will be the base directory

  constructor(
    @Inject('videoStoreRepository') private videoStoreRepository: typeof VideoStore,
    @Inject('videoEditStoreRepository') private videoEditStoreRepository: typeof VideoEditStore,
  ) {
    Ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe');
    Ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');
  }

  async merge(createVideoOperationDto: CreateVideoOperationDto) {
    return await 'This action adds a new videoOperation';
  }

  async getFileDetails(id: string) {
    return await this.videoStoreRepository.findOne({ where: { id } });
  }

  async trim(id: number, start: number, end: number) {
    // Find the video by ID
    if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
      throw new BadRequestException('Invalid start or end time');
    }
    const video = await this.videoStoreRepository.findOne({ where: { id } });
    if (!video) throw new Error('Video not found');

    // Get the base directory and the file path of the video
    const baseDir = path.join(__dirname, '../../assets/videos'); // Ensure this is correct
    const originalFilePath = path.join(baseDir, video.filePath);

    // Check if the original video file exists
    if (!fs.existsSync(originalFilePath)) {
      throw new Error('Original video file does not exist');
    }

    // Set up the output file path for the trimmed video
    const outputFilePath = path.join(__dirname, 'output', `${id}_trimmed.mp4`);
    
    // Ensure the output directory exists
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Start the trimming process using fluent-ffmpeg
    return new Promise<string>((resolve, reject) => {
      Ffmpeg(originalFilePath)
        .setStartTime(start) // Set the start time
        .setDuration(end - start) // Set the duration based on the start and end times
        .output(outputFilePath) // Define the output file path
        .on('end', () => {
          console.log('Trimming finished');
          resolve(outputFilePath); // Return the output file path after trimming
        })
        .on('error', (err) => {
          console.error('Error during trimming:', err);
          reject(err); // Reject the promise if there's an error
        })
        .run(); // Execute the ffmpeg command
    });
  }


  async upload(fileObject: Express.Multer.File) {
    try {
      console.log('Uploaded file object:', fileObject);

      if (!fileObject) {
        throw new Error('File not uploaded or path is missing');
      }

      const { originalname, size, buffer } = fileObject;

      const relativePath = `${Date.now()}-${originalname}`;
      const newFilePath = path.join(this.baseDir, relativePath);

      if (!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
      }

      fs.writeFileSync(newFilePath, buffer);

      const duration = await this.getVideoDuration(newFilePath);

      const video = await this.videoStoreRepository.create({
        filePath: relativePath,  
        size: size,
        duration: duration,
        expiryTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        created_by: 'user123',
        updated_at: new Date(),
        created_at: new Date(),
        updated_by: 'user123',
      });
      console.log(video.id); // To check the generated id

      return video.toJSON();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      Ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const duration = metadata.format.duration;
          resolve(duration);
        }
      });
    });
  }

  getAbsoluteFilePath(relativePath: string): string {
    return path.join(this.baseDir, relativePath);
  }
}
