import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PaymentMethod } from 'src/common/enums/payment.enum';

@Schema()
export class OrderItem {
  @Prop()
  productName: string;

  @Prop()
  filePath?: string;

  @Prop()
  new: boolean;

  @Prop()
  discount: number;

  @Prop()
  price: number;

  @Prop()
  color: string;

  @Prop()
  stock: number;

  @Prop()
  wishlist?: boolean;

  @Prop()
  discountTill: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: mongoose.Types.ObjectId;

  @Prop()
  purchasedQty: number;

  @Prop()
  orderCode: string;


    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id?: mongoose.Types.ObjectId;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Purchase {
  @Prop() name: string;
  @Prop() lastName: string;
  @Prop() phoneNumber: string;
  @Prop() yourEmail: string;
  @Prop() streetAddress: string;
  @Prop() townCity: string;
  @Prop() country: string;
  @Prop() state: string;
  @Prop() zipCode: string;
  @Prop() expirationDate: string;
  @Prop() CVC: string;
  @Prop() differentBilling?: boolean;
  @Prop() paymentMethod: PaymentMethod;
  @Prop() shipping: number;
  @Prop() subtotal: number;
  @Prop() shippingOption: string;
  @Prop() total: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [OrderItemSchema], default: [] })
  order: OrderItem[];
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
