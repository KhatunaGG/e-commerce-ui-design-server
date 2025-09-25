import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AnswerDto {
  @IsString()
  answersOwnerId: string;

  // @IsString()
  // answerToQuestionsOwnerId: string;

  @IsString()
  answerText: string;

  @IsString()
  status: string;










  @IsOptional()
  @IsString()
  answerOwnerLastName?: string;

  @IsOptional()
  @IsString()
  answerOwnerName?: string;
}

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsString()
  questionsOwnerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsString()
  productId: string;

  @IsString()
  status: string;
}
