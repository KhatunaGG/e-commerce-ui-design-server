import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3 } from '@aws-sdk/client-s3';
import { AwsS3Service } from './aws-s3/aws-s3.service';
import { UtilitiesService } from './utilities/utilities.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private s3: AwsS3Service,
    private utilitiesService: UtilitiesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const path = Math.random().toString().slice(2);
    const type = file.mimetype.split('/')[1];
    const filepath = `e-commerce-ui-design/${path}`;
    return this.appService.uploadImage(filepath, file.buffer);
  }
}
