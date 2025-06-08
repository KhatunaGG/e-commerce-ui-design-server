import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Utility {
  @Prop({ type: String, required: true })
  imageName: string;

  @Prop()
  filePath: string;
}

export const UtilitySchema = SchemaFactory.createForClass(Utility);
