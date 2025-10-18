import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  @IsString()
  userName?: string;

  @ValidateIf((o) => !o.userName)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  rememberMe: boolean;
}
