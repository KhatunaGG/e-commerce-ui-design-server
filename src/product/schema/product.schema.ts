import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  productName: string;

  @Prop()
  filePath: string;

  //   @Prop({ type: Array, default: [] })
  @Prop({ type: [String], default: [] })
  pages: string[];

  //   @Prop({ type: Array, default: [] })
  @Prop({ type: [String], default: [] })
  components?: string[];

  @Prop()
  new: boolean;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, default: 0 })
  rate: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }])
  reviews: mongoose.Schema.Types.ObjectId[];
  // reviews: Types.ObjectId[];

  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question', default: [] },
  ])
  questions?: string[];

  //   @Prop({ type: Array, default: [] })
  @Prop({ type: [String], default: [] })
  category: string[];

  @Prop({ type: Number, default: 0.0 })
  price: number;

  @Prop({ type: Array, default: [] })
  colors: string[];

  @Prop({ type: Number })
  stock: number;

  @Prop({ default: false })
  wishlist: boolean;

  @Prop()
  measurements?: string;

  @Prop()
  details: string;

  @Prop({ type: Date, required: false })
  discountTill?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
