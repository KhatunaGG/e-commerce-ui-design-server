import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReplyDto {
  @IsString()
  replyToId: string;

  @IsString()
  replyOwnerId: string;

  @IsString()
  replyText: string;
}

class QuestionDto {
  @IsString()
  questions: string;

  @IsString()
  questionsOwnerId: string;

//   @IsString()
//   productId: string;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
