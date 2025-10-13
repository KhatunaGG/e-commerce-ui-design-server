import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class EmailSenderService {
  constructor(private emailService: MailerService) {}

  async sendEmail(
    // userId: Types.ObjectId | string,
    // fullName: string,
    yourEmail: string,
    message: string,
    senderName: string,
    senderLastName: string,
    senderEmail: string,
  ) {
    try {
      await this.emailService.sendMail({
        from: `${senderName} ${senderLastName}<${senderEmail}>`,
        to: yourEmail,
        subject: 'New Contact Message form E-Commerce-UI-Design',
        html: `
        <p><strong>From:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      });
      return { success: true };
    } catch (e) {
      console.log('Email Error Details:', e.message);
      throw e;
    }
  }
}
