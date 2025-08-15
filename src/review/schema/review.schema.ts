import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Questions {
  @Prop()
  questions: string;

  @Prop()
  questionsOwnerId: string;

//   @Prop()
//   productId: string;
}

@Schema({ timestamps: true })
export class Reply {
  @Prop()
  replyToId: string;

  @Prop()
  replyOwnerId: string;

  @Prop()
  replyText: string;
}

@Schema({ timestamps: true })
export class Review {
  @Prop()
  reviewOwnerId: string | null;

  @Prop()
  likes: number;

  @Prop()
  status: string;

  @Prop()
  rating: number;

  @Prop()
  replies: Reply[];

  //   @Prop()
  //   _id?: string;

  @Prop()
  questions: Questions[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
