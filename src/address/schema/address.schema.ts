import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const AddressSchema = SchemaFactory.createForClass(Address);
