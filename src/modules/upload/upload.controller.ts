import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'node:path';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@Public()
@SkipThrottle()
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 10 * 1024 * 1024, // 2MB
      },
      fileFilter(req, file, callback) {
        if (!['png', 'jpg', 'jpeg'].includes(extname(file.originalname).slice(1))) {
          throw new BadRequestException('Chỉ cho phép tải lên các tệp hình ảnh');
        }
        callback(null, true);
      },
    }),
  )
  @Post('image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
