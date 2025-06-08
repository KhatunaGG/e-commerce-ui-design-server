import {
  Controller,
  Get,
  Post,
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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const path = Math.random().toString().slice(2);
    const type = file.mimetype.split('/')[1];
    const filepath = `e-commerce-ui-design/home/${path}`;
    return this.appService.uploadImage(filepath, file.buffer);
  }

  // @Post("upload-many")
  // @UseInterceptors(FileInterceptor("file"))
  // uploadManyFiles(@UploadedFiles() files: Express.Multer.File) {
  //   return this.awsS3Service.uploadManyFiles(files)
  // }

  @Get('all-images')
  async getAllImages() {
    const allImages = await this.utilitiesService.findAllSorted();
    console.log(allImages, "allImages")
    const result = await Promise.all(
      allImages.map(async (img) => {
        const presignedUrl = await this.s3.getPresignedUrl(img.filePath);
        return {
          imageName: img.imageName,
          url: presignedUrl,
        };
      }),
    );
    console.log(result, "result")

    return result;
  }
}
