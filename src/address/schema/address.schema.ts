import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Address {
  @Prop()
  streetAddress: string;

  @Prop()
  townCity: string;

  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  zipCode: string;

  @Prop({ default: false })
  differentBilling: boolean;

  @Prop()
  type: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  addressOwnerId: mongoose.Schema.Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
