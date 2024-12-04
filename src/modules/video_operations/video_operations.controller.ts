import { Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoOperationsService } from './video_operations.service';

@Controller('video-operations')
export class VideoOperationsController {
  constructor(private readonly videoOperationsService: VideoOperationsService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  uploadVideo(@UploadedFile() files: Express.Multer.File,) {
    return this.videoOperationsService.upload(files);
  }
  @Get('get-file-details/:id')
  getFileData(@Param('id') id: string) {
    return this.videoOperationsService.getFileDetails(id);
  }
  async trim(
    @Param('id') id: number, // Video ID from the URL
    @Query('start') start: number, // Start time in seconds (query param)
    @Query('end') end: number, // End time in seconds (query param)
  ) {

    await this.videoOperationsService.trim(id, start, end);
  }
}
