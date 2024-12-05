import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { VideoOperationsService } from './video_operations.service';

describe('VideoOperationsService', () => {
    let service: VideoOperationsService;
    let videoStoreRepository: any;
    let videoEditStoreRepository: any;

    beforeEach(async () => {
        videoStoreRepository = { findOne: jest.fn() };
        videoEditStoreRepository = { create: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VideoOperationsService,
                { provide: 'videoStoreRepository', useValue: videoStoreRepository },
                { provide: 'videoEditStoreRepository', useValue: videoEditStoreRepository },
            ],
        }).compile();

        service = module.get<VideoOperationsService>(VideoOperationsService);
    });

    describe('trim', () => {
        it('should trim a video locally and return the path to the trimmed video', async () => {
            const videoData = { id: 1, filePath: 'path/to/video.mp4', duration: 30 };

            videoStoreRepository.findOne.mockResolvedValue(videoData);
            jest.spyOn(fs, 'existsSync').mockReturnValue(true);
            jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

            const trimmedFilePath = './example_media.mp4';
            const result = await service.trim(1, 5, 10);

            console.log('Trimmed string', result);
            expect(result).toEqual(trimmedFilePath);
            expect(videoStoreRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(fs.existsSync).toHaveBeenCalledWith(videoData.filePath);
            expect(fs.writeFileSync).toHaveBeenCalled();
        });

        it('should throw an error if the start or end time is invalid', async () => {
            await expect(service.trim(1, NaN, 10)).rejects.toThrow(BadRequestException);
        });

        it('should throw an error if the video is not found', async () => {
            videoStoreRepository.findOne.mockResolvedValue(null);

            await expect(service.trim(1, 5, 10)).rejects.toThrow(BadRequestException);
        });
    });
});
