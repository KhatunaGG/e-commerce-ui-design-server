// import { Transform } from 'class-transformer';
// import { IsNotEmpty, IsString } from 'class-validator';

// export class SignInDto {
//   @IsNotEmpty()
//   @IsString()
//   userName: string;

//   @IsNotEmpty()
//   @IsString()
//   @Transform(({ value }) => value.toLowerCase())
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   password: string;
// }

import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @ValidateIf((o) => !o.email) // Only validate if email is not provided
  @IsNotEmpty()
  @IsString()
  userName?: string;

  @ValidateIf((o) => !o.userName) // Only validate if userName is not provided
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
