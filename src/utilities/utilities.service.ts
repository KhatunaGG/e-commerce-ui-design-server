import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Utility } from './schema/utilities.schema.';
import { Model, Types } from 'mongoose';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectModel(Utility.name) private utilUtilitiesService: Model<Utility>,
    private s3Service: AwsS3Service,
  ) {}

  async create(createUtilityDto: CreateUtilityDto) {
    const { filePath, imageName } = createUtilityDto;
    if (!filePath || !imageName)
      throw new BadGatewayException('Image and Image name is required');
    try {
      const newUtility =
        await this.utilUtilitiesService.create(createUtilityDto);
      return newUtility;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getUtilitiesByPage(query: string) {
    try {
      if (!query) return [];

      const filtered = await this.utilUtilitiesService.find({ pages: query });

      const filteredImages = await Promise.all(
        filtered.map(async (imgDoc) => {
          const img = imgDoc.toObject();
          const url = await this.s3Service.getPresignedUrl(img.filePath);
          return {
            _id: img._id,
            imageName: img.imageName,
            filePath: img.filePath,
            pages: img.pages,
            componentUsage: img.componentUsage,
            presignedUrl: url,
            title: img.title ?? '',
          };
        }),
      );

      return filteredImages;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
