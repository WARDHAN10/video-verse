import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoOperationDto } from './create-video_operation.dto';

export class UpdateVideoOperationDto extends PartialType(CreateVideoOperationDto) {}
