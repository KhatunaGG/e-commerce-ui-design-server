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
import { AddressModule } from './address/address.module';
import { ReviewModule } from './review/review.module';
import { QuestionModule } from './question/question.module';
import { BlogModule } from './blog/blog.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { MailerModule } from '@nestjs-modules/mailer';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },

      defaults: {
        from: '"No Reply" <no-reply@yourdomain.com>',
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EmailSenderModule,
    UtilitiesModule,
    AwsS3Module,
    UserModule,
    AuthModule,
    ProductModule,
    PurchaseModule,
    AddressModule,
    ReviewModule,
    QuestionModule,
    BlogModule,
    EmailSenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
