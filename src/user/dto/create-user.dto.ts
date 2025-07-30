import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  yourName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isTerms: boolean;

  @IsOptional()
  @IsArray()
  orders?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  reviews?: Types.ObjectId[];



  
  @IsOptional()
  @IsString()
  lastName?: string;
}
