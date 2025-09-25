import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Answer {
  // @Prop()
  // answersOwnerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  answersOwnerId: Types.ObjectId;

  // @Prop()
  // answerToQuestionsOwnerId: string;

  @Prop()
  answerText: string;

  @Prop()
  status: string;

  @Prop()
  answerOwnerLastName: string;

  @Prop()
  answerOwnerName: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ timestamps: true })
export class Question {
  @Prop()
  question: string;

  @Prop()
  questionsOwnerId: string;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];

  @Prop()
  productId: string;

  @Prop()
  status: string;






  
  @Prop()
  questionOwnerName: string;
@Prop()
  questionOwnerLastName: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
