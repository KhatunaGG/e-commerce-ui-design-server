import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Utility {
  @Prop({ type: String, required: true })
  imageName: string;

  @Prop()
  filePath: string;

  @Prop({ type: Array, default: [] })
  pages: string[];

  @Prop({ type: Array, default: [] })
  componentUsage?: string[];


  
  @Prop({ type: String, required: false, default: "" })
  title?: string;


}

export const UtilitySchema = SchemaFactory.createForClass(Utility);
