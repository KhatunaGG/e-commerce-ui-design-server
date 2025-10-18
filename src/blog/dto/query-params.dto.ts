import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsString()
  @IsOptional()
  page?: string = '1';

  @IsString()
  @IsOptional()
  take?: string = '6';

  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';
}
