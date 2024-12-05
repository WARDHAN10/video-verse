import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';

export function FileUpload(
    fieldName: string,
    maxSize: number = 5 * 1024 * 1024,
    destinationFolder: string = './uploads',
): MethodDecorator {
    const storage = diskStorage({
        destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            cb(null, destinationFolder);
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        },
    });

    return applyDecorators(UseInterceptors());
}
