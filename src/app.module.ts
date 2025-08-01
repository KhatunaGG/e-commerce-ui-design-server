import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilitiesModule } from './utilities/utilities.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PaymentModule } from './payment/payment.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    // ConfigModule.forRoot(),
      ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),

    UtilitiesModule,

    AwsS3Module,

    UserModule,

    AuthModule,

    ProductModule,

    PurchaseModule,

    PaymentModule,

    AddressModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
