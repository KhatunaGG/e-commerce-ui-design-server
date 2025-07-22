import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUtilityDto {
  @IsString()
  @IsNotEmpty()
  imageName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  pages: string[];

  @IsOptional()
  @IsString()
  components?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
