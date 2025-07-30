import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Post('create-intent')
  // async createIntent(@Body() body: { amount: number }) {
  //   const amountInDollars = body.amount;
  //   const amountInCents = Math.round(amountInDollars * 100); 
  //   return this.paymentService.createPaymentIntent(amountInCents);
  // }

@Post('create-intent')
async createIntent(@Body() body: { amount: number }) {
  try {
    const amountInDollars = body.amount;
    const amountInCents = Math.round(amountInDollars * 100);
    
    console.log('Creating payment intent for:', amountInCents, 'cents');
    
    const paymentIntent = await this.paymentService.createPaymentIntent(amountInCents);
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw new BadRequestException('Failed to create payment intent');
  }
}

@Post('confirm-payment')
async confirmPayment(@Body() body: { paymentIntentId: string }) {
  try {
    return await this.paymentService.confirmPayment(body.paymentIntentId);
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    throw new BadRequestException('Failed to confirm payment');
  }
}

}
