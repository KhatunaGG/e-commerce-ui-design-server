import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ArticleDto {
  @IsNotEmpty()
  @IsString()
  articleTitle: string;

  @IsNotEmpty()
  @IsString()
  context: string;

  @IsArray()
  @IsString({ each: true })
  filePath: string[];
}

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  authorFName: string;

  @IsOptional()
  @IsString()
  authorLName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleDto)
  articles: ArticleDto[];

  @IsOptional()
  @IsString()
  authorId: string;
}
