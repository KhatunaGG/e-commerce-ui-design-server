import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class AnswerDto {
  @IsString()
  answersOwnerId: string;

  @IsString()
  questionsOwnerId: string;

  @IsString()
  answerText: string;

  @IsString()
  status: string;
}

export class CreateQuestionDto {
  @IsString()
  questions: string;

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
