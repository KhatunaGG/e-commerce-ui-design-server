import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilitiesModule } from './utilities/utilities.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsS3Module } from './aws-s3/aws-s3.module';

@Module({
  imports: [
    // ConfigModule.forRoot(),
      ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    UtilitiesModule,

    AwsS3Module,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
