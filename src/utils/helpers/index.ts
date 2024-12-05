import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

export function getOriginalFilePath(filePath: string): string {
    const baseDir = path.join(__dirname, '../../assets/videos');
    return path.join(baseDir, filePath);
}

export function ensureFileExists(filePath: string) {
    if (!fs.existsSync(filePath)) {
        throw new Error('Original video file does not exist');
    }
}

export function getOutputFilePath(id: number): string {
    return path.join(__dirname, 'output', `${id}_trimmed.mp4`);
}

export function ensureDirectoryExists(filePath: string) {
    const outputDir = path.dirname(filePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
}


export function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err) => reject(err));
    });
}

export function checkFileSize(fileSizeInBytes:number): boolean {
    const minSize = 5 * 1024 * 1024;
    const maxSize = 25 * 1024 * 1024;

    if (fileSizeInBytes >= minSize && fileSizeInBytes <= maxSize) {
        console.log('File size is within the allowed range.');
        return true;
    } else {
        console.log('File size must be between 5 MB and 25 MB.');
        return false;
    }
};

