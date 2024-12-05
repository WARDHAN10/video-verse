<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app in watch mode

```bash
# development
$ npm run start

## Test

```bash
# unit tests
$ npm run test
```
Prerequisites
Before running the application, ensure the following are set up:

AWS Account for S3 or Cloudflare R2:

You'll need an AWS account with S3 credentials or a Cloudflare R2 account for object storage.
Update the environment variables for your storage service in the .env file.
Database Setup:

Configure your database Sqlite and update the connection settings in the .env file.
Ensure the database is running and accessible.
FFmpeg Installation:

Install FFmpeg on your system, which is required for media processing.
```bash
$ ffmpeg -version
```
# Dependencies
## Dependencies

### `multer`
Multer is middleware for handling multipart/form-data, which is used for uploading files in Node.js applications.

### `cloudinary`
Cloudinary is a cloud-based service for media management, offering tools for uploading, transforming, and delivering images and videos.

### `@aws-sdk/client-s3`
The AWS SDK for interacting with Amazon S3, allowing for file uploads, downloads, and bucket management in your AWS infrastructure.

### `sequelize`
Sequelize is a promise-based ORM for Node.js that supports various relational databases (MySQL, PostgreSQL, SQLite, etc.), providing an easy way to query and handle transactions.

### `sequelize-typescript`
Adds TypeScript support for Sequelize ORM, providing decorators and type safety for model definitions.

### `sqlite3`
SQLite3 is a lightweight, serverless SQL database engine used for storing data in a single file, ideal for small to medium-sized applications.

### `axios`
Axios is a promise-based HTTP client for making API requests, supporting both browser and Node.js environments.

### `moment`
Moment is a library for parsing, validating, manipulating, and formatting dates and times in JavaScript.

### `moment-timezone`
An extension of Moment.js that adds support for manipulating dates and times with time zone support.

### `aws-sdk`
The AWS SDK for JavaScript enables interaction with various AWS services like S3, DynamoDB, Lambda, and more.

### `formidable`
Formidable is a Node.js module for parsing form data, especially file uploads, and handling multipart requests.

### `reflect-metadata`
A library that enables the use of TypeScript decorators and metadata reflection, commonly used in frameworks like NestJS.

### `fluent-ffmpeg`
Fluent-ffmpeg is a powerful and easy-to-use Node.js library that simplifies interacting with the FFmpeg multimedia framework for tasks like video/audio conversion, manipulation, and streaming.

## Referred Links

- [Cloudflare R2 Example: AWS SDK for JavaScript](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js/)
- [How to Trim a Video Stored on Another Server via Our Node.js Server](https://stackoverflow.com/questions/74461800/how-to-trim-a-video-stored-in-another-sever-via-our-node-js-server)
- [Trim and Concatenate Audio Files in Node.js](https://stackoverflow.com/questions/48893315/trim-and-concat-audio-files-in-node-js)
- [Node.js Fluent-FFmpeg: Cannot Find FFmpeg](https://stackoverflow.com/questions/45555960/nodejs-fluent-ffmpeg-cannot-find-ffmpeg)
- [FFmpeg.js Alternatives](https://js.libhunt.com/ffmpeg-js-alternatives)

