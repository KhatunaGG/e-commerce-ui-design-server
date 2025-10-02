import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Article {
  @Prop()
  articleTitle: string;

  @Prop()
  context: string;

  @Prop()
  filePath: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);


@Schema({ timestamps: true })
export class Blog {
  @Prop()
  filePath: string;

  @Prop()
  title: string;

  @Prop({ required: false })
  authorFName?: string;

  @Prop({ required: false })
  authorLName?: string;

  @Prop({ type: [Article], default: [] })
  articles: Article[];

  //   @Prop()
  //   authorId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  authorId?: Types.ObjectId;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
