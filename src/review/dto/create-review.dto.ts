import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LikeDto {
  @IsString()
  likedById: string;

  @IsNumber()
  like: number;
}

export class RateDto {
  @IsString()
  ratedById: string;

  @IsNumber()
  rating: number;
}

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RateDto)
  ratedBy: RateDto[];

  @IsOptional()
  @IsString()
  _id?: string;
}

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  reviewOwnerId: string;

  // @IsNumber()
  // likes: number;

  @IsString()
  status: string;

  @IsNumber()
  rating: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReplyDto)
  replies: ReplyDto[];

  @IsString()
  reviewText: string;

  @IsString()
  productId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RateDto)
  ratedBy: RateDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LikeDto)
  likes: LikeDto[];
}
