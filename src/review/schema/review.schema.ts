import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ---------------------------------
// ANSWERS SCHEMA
// ---------------------------------

// @Schema({ timestamps: true })
// export class Answer {
//   @Prop()
//   answersOwnerId: string;

//   @Prop()
//   questionsOwnerId: string;

//   @Prop()
//   answerText: string;
// }

// export const AnswerSchema = SchemaFactory.createForClass(Answer);

// ---------------------------------
// QUESTIONS SCHEMA
// ---------------------------------

// @Schema({ timestamps: true })
// export class Question {
//   @Prop()
//   questions: string;

//   @Prop()
//   questionsOwnerId: string;

//   @Prop({ type: [AnswerSchema], default: [] })
//   answers: Answer[];
// }

// export const QuestionSchema = SchemaFactory.createForClass(Question);

// ---------------------------------
// REPLY SCHEMA
// ---------------------------------

@Schema({ timestamps: true })
export class Reply {
  @Prop()
  productId: string;

  @Prop()
  replyToId?: string;

  @Prop()
  replyOwnerId?: string;

  @Prop()
  status: string;

  @Prop()
  text: string;






@Prop()
  replyOwnerName: string;

  @Prop()
  replyOwnerLastName: string;

}

export const ReplySchema = SchemaFactory.createForClass(Reply);

// ---------------------------------
// REVIEW SCHEMA
// ---------------------------------

@Schema({ timestamps: true })
export class Review {
  @Prop()
  reviewText: string;

  @Prop()
  productId: string;

  @Prop()
  reviewOwnerId: string | null;

  @Prop()
  likes: number;

  @Prop()
  status: string;

  @Prop()
  rating: number;

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];

  // @Prop({ type: [QuestionSchema], default: [] })
  // questions: Question[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
