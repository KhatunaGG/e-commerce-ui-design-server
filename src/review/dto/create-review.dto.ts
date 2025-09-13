import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReplyDto {
  @IsString()
  productId: string;

  @IsString()
  replyToId: string;

  @IsString()
  replyOwnerId: string;

  @IsString()
  status: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  replyOwnerName?: string;

  @IsOptional()
  @IsString()
  replyOwnerLastName?: string;
}

// export class AnswerDto {
//   @IsString()
//   answersOwnerId: string;

//   @IsString()
//   questionsOwnerId: string;

//   @IsString()
//   answerText: string;
// }

// export class QuestionDto {
//   @IsString()
//   questions: string;

//   @IsString()
//   questionsOwnerId: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => AnswerDto)
//   answers: AnswerDto[];
// }

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  reviewOwnerId: string;

  @IsNumber()
  likes: number;

  @IsString()
  status: string;

  @IsNumber()
  rating: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReplyDto)
  replies: ReplyDto[];

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => QuestionDto)
  // questions: QuestionDto[];

  @IsString()
  reviewText: string;

  @IsString()
  productId: string;
}
