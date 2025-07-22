import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  pages: string[];

  @IsOptional()
  @IsArray()
  components?: string[];

  @IsBoolean()
  new: boolean;

  @IsNumber()
  discount: number;

  @IsNumber()
  rate: number;

  @IsOptional()
  @IsArray()
  reviews?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  questions?: string[];


  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  category: string[];

  @IsNumber()
  price: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  colors: string[];

  @IsNumber()
  stock: number;

  @IsBoolean()
  wishlist: boolean;

  @IsOptional()
  @IsString()
  measurements?: string;

  @IsString()
  details: string;


  @IsOptional()
  @IsDateString(
    {},
    { message: 'discountTill must be a valid ISO 8601 date string' },
  )
  discountTill?: string;
}
