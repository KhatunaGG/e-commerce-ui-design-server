import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Utility, UtilitySchema } from './schema/utilities.schema.';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Utility.name, schema: UtilitySchema }]),
    AwsS3Module,
  ],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
  exports: [UtilitiesService],
})
export class UtilitiesModule {}
