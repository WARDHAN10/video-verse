import { Module } from '@nestjs/common';
import { VideoOperationsController } from './video_operations.controller';
import { videoEditStoreProvider, videoStoreProvider } from './video_operations.provider';
import { VideoOperationsService } from './video_operations.service';

@Module({
  controllers: [VideoOperationsController],
  providers: [VideoOperationsService, ...videoEditStoreProvider, ...videoStoreProvider],
  exports: [VideoOperationsService]
})
export class VideoOperationsModule { }
