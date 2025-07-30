import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { PaymentMethod } from 'src/common/enums/payment.enum';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsOptional()
  filePath?: string;

  @IsBoolean()
  @IsNotEmpty()
  new: boolean;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsBoolean()
  @IsOptional()
  wishlist?: boolean;

  @IsString()
  @IsNotEmpty()
  discountTill: string;

  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  purchasedQty: number;

  @IsString()
  @IsNotEmpty()
  orderCode: string;

    @IsNotEmpty()
  @IsString()
  _id?: string | Types.ObjectId;
}

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  yourEmail: string;

  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @IsString()
  @IsNotEmpty()
  townCity: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  expirationDate: string;

  @IsString()
  @IsNotEmpty()
  CVC: string;

  @IsBoolean()
  @IsOptional()
  differentBilling?: boolean;

  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: 'Payment method must be either "card" or "paypal"',
  })
  paymentMethod: PaymentMethod;

  @IsNumber()
  @IsNotEmpty()
  shipping: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsString()
  @IsNotEmpty()
  shippingOption: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsMongoId()
  @IsOptional()
  userId?: mongoose.Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  order: OrderItemDto[];
}
