import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @Transform(({ value }) => Number(value) || 1)
  @IsNumber()
  page: number = 1;

  @Transform(({ value }) => Number(value) || 5)
  @IsNumber()
  take: number = 5;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  countOnly?: boolean;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort: 'asc' | 'desc' = 'desc';
}
