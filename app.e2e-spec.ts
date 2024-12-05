import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as request from 'supertest';
import { AppModule } from './src/app.module';
describe('VideoOperationsController (e2e)', () => {
  let app: INestApplication;

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
      originalname: 'test.mp4',
      encoding: 'utf-8',
      mimetype: 'video/mp4',
      buffer: buffer,
      size: 1024,
    };

    // First, upload the video
    const uploadResponse = await request(app.getHttpServer())
      .post('/video-operations/upload')
      .attach('file', file.buffer, 'test.mp4')
      .expect(201);
    console.log('Upload response',uploadResponse.body);
    const videoId = uploadResponse.body.id;

    // Now trim the video
    const trimResponse = await request(app.getHttpServer())
      .patch(`/video/trim/${videoId}`)
      .send({ start: 5, end: 10 })
      .expect(200);

    expect(trimResponse.body).toHaveProperty('url');
  });

  afterAll(async () => {
    await app.close();
  });
});
