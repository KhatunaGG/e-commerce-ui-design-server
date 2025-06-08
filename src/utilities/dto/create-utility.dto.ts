import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUtilityDto {
  @IsString()
  @IsNotEmpty()
  imageName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;
}
