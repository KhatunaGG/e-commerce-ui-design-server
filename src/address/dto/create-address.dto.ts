import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {

    @IsString()
  streetAddress: string;

  @IsString()
  townCity: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsBoolean()
  differentBilling?: boolean;


  @IsString()
  type: string

}
