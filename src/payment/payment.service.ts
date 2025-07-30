// import { Injectable } from '@nestjs/common';
// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';

// @Injectable()
// export class PaymentService {
//   constructor()
//   create(createPaymentDto: CreatePaymentDto) {
//     return 'This action adds a new payment';
//   }

//   // findAll() {
//   //   return `This action returns all payment`;
//   // }

//   // findOne(id: number) {
//   //   return `This action returns a #${id} payment`;
//   // }

//   // update(id: number, updatePaymentDto: UpdatePaymentDto) {
//   //   return `This action updates a #${id} payment`;
//   // }

//   // remove(id: number) {
//   //   return `This action removes a #${id} payment`;
//   // }
// }

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    // this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    //   apiVersion: "2025-06-30.basil",
    // });
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  // async createPaymentIntent(amount: number) {
  //  return this.stripe.paymentIntents.create({
  //   amount,
  //   currency: 'usd',
  //   payment_method_types: ['card'],
  // });
  // }

  async createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });
  }

  async confirmPayment(paymentIntentId: string) {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }
}
