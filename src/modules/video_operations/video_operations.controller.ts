import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoOperationsService } from './video_operations.service';

@Controller('video-operations')
export class VideoOperationsController {
  constructor(private readonly videoOperationsService: VideoOperationsService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  async uploadVideo(@UploadedFile() files: Express.Multer.File,) {
    return await this.videoOperationsService.upload(files);
  }
  @Get('get-file-details/:id')
  async getFileData(@Param('id') id: string) {
    return await this.videoOperationsService.getFileDetails(id);
  }
  @Post('trim/:id')
  async trim(
    @Param('id') id: number, 
    @Query('start') start: string, 
    @Query('end') end: string, 
  ) {
    return await this.videoOperationsService.trim(id, parseInt(start), parseInt(end));
  }
  
@Post('merge')
async processBatch(@Body('video_ids') videoIds: string[]) {
  return await this.videoOperationsService.mergeVideosFromR2(videoIds);
}
}

