import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Answer {
  @Prop()
  answersOwnerId: string;

  @Prop()
  questionsOwnerId: string;

  @Prop()
  answerText: string;

  @Prop()
  status: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ timestamps: true })
export class Question {
  @Prop()
  questions: string;

  @Prop()
  questionsOwnerId: string;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];

  @Prop()
  productId: string;

  @Prop()
  status: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
