import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Utility } from './schema/utilities.schema.';
import { Model } from 'mongoose';

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectModel(Utility.name) private utilUtilitiesService: Model<Utility>,
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

  findAll() {
    return `This action returns all utilities`;
  }

  async findAllSorted() {
    return this.utilUtilitiesService.find().sort({ createdAt: 1 }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} utility`;
  }

  update(id: number, updateUtilityDto: UpdateUtilityDto) {
    return `This action updates a #${id} utility`;
  }

  remove(id: number) {
    return `This action removes a #${id} utility`;
  }
}
