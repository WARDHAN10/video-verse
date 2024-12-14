import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import request from 'supertest';
import { AppModule } from './src/app.module';
describe('VideoOperationsController (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(240000); 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should upload and trim a video successfully', async () => {
    const buffer = fs.createReadStream('./example_media.mp4');
    const file = {
      fieldname: 'file',
      originalname: 'example_media.mp4',
      encoding: 'utf-8',
      mimetype: 'video/mp4',
      buffer: buffer,
      size: 1024,
    };
    const authToken: string = `sh28NyMUIcFMFrkwA4ticgXUWGdp3fKNxbrXIFqDJikzYYICmN`; // Replace with your token

    // First, upload the video
    const uploadResponse = await request(app.getHttpServer())
      .post('/video-operations/upload')
      .set('x-auth-token', authToken)
      .attach('files', file.buffer, 'example_media.mp4')
      .expect(201);
    console.log('Upload response - /upload', uploadResponse.body);
    const videoId = uploadResponse.body.id;

    // Now trim the video
    const trimResponse = await request(app.getHttpServer())
      .post(`/video-operations/trim/${videoId}?start=2&end=2`)
      .set('x-auth-token', authToken)
      .expect(201);
    console.log('Trim-Response', trimResponse.body);

    const mergeResponse = await request(app.getHttpServer())
    .post('/video-operations/merge')
    .set('x-auth-token', authToken)
    .send({
      video_ids: ['1', '3'],  // Sending an array of video IDs
    })
    .expect(201);
  console.log('Merge-Response', mergeResponse.body);
    expect(mergeResponse.body).toHaveProperty('url');
  });

  afterAll(async () => {
    await app.close();
  });
});
