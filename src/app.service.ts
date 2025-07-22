import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AwsS3Service } from './aws-s3/aws-s3.service';

@Injectable()
export class AppService {
  constructor(private s3: AwsS3Service) {}
  getHello(): string {
    return 'Hello World!';
  }

  async uploadImage(filePath: string, file: Buffer) {
    if (!filePath || !file) throw new BadRequestException('FilePath and file are required');;
   console.log('Service received - FilePath:', filePath, 'File size:', file.length);
    try {
      const filePathFromAws = await this.s3.uploadFile(filePath, file);
     if (!filePathFromAws) {
      throw new NotFoundException('Failed to upload file to S3');
    }
    
      console.log(filePathFromAws, "filePathFromAws")
      return filePathFromAws;
    } catch (e) {
      console.log(e);
    }
  }
}
