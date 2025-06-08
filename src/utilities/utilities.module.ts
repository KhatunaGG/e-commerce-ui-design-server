import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Utility, UtilitySchema } from './schema/utilities.schema.';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Utility.name, schema: UtilitySchema }]),
  ],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
  exports: [UtilitiesService],
})
export class UtilitiesModule {}
