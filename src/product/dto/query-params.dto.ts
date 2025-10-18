import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryParamsDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number;

  @IsOptional()
  category?: string;

  @IsOptional()
  priceRange?: string;

  @IsOptional()
  sortBy?: 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';
}
