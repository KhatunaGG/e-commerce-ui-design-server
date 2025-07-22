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

  //     @Post('upload')
  //   @UseInterceptors(FileInterceptor('file'))
  //  async  uploadFile(@UploadedFile() file: Express.Multer.File) {
  //    console.log('File details:');
  //   console.log('- Original name:', file.originalname);
  //   console.log('- Mimetype:', file.mimetype);
  //   console.log('- Size:', file.size);
  //   console.log('- Buffer length:', file.buffer?.length);
  //     const path = Math.random().toString().slice(2);
  //     const type = file.mimetype.split('/')[1];
  //     const filepath = `e-commerce-ui-design/${path}`;
  //     // console.log('Generated filepath:', filepath);
  //      console.log('Generated filepath:', filepath);
  //   console.log('About to call service...');

  //   const result = await this.appService.uploadImage(filepath, file.buffer);

  //   console.log('Upload result from service:', result);

  //   }

  // @Post("upload-many")
  // @UseInterceptors(FileInterceptor("file"))
  // uploadManyFiles(@UploadedFiles() files: Express.Multer.File) {
  //   return this.awsS3Service.uploadManyFiles(files)
  // }

  //   @Get('by-page') //????
  //  async getAllImages(@Query('page') page: string)  {
  //     const allImages = await this.utilitiesService.getUtilitiesByPage(page);
  //     const result = await Promise.all(
  //       allImages.map(async (img) => {
  //         const presignedUrl = await this.s3.getPresignedUrl(img.filePath);
  //         return {
  //           imageName: img.imageName,
  //           url: presignedUrl,
  //         };
  //       }),
  //     );
  //     return result;
  //   }
}
