import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './schema/address.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AddressService {
  constructor(
    // @InjectModel(Address.name) private addressService: Model<Address>,
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async create(
    userId: Types.ObjectId | string,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    if (!userId) throw new UnauthorizedException();

    try {
      const { townCity, country, state, zipCode, type } = createAddressDto;
      const existingAddress = await this.addressModel.findOne({
        addressOwnerId: userId,
        townCity,
        country,
        state,
        zipCode,
        type,
      });
      if (existingAddress) {
        return existingAddress;
      }
      const newAddress = new this.addressModel({
        ...createAddressDto,
        addressOwnerId: userId,
      });
      const savedAddress = await newAddress.save();
      if (type === 'shipping') {
        const shippingCount = await this.addressModel.countDocuments({
          addressOwnerId: userId,
          type: 'shipping',
        });

        if (shippingCount === 1) {
          const billingAddressExists = await this.addressModel.findOne({
            addressOwnerId: userId,
            type: 'billing',
          });
          if (!billingAddressExists) {
            const billingAddress = new this.addressModel({
              ...createAddressDto,
              addressOwnerId: userId,
              type: 'billing',
            });
            await billingAddress.save();
          }
        }
      }

      return savedAddress;
    } catch (e) {
      console.error('Address creation error:', e);
      throw new UnauthorizedException();
    }
  }

  async findAll(userId: Types.ObjectId | string, isAdmin) {
    if (!userId) throw new UnauthorizedException();
    // console.log(isAdmin, 'isAdmin');
    // console.log(userId, 'userId');
    try {
      let allAddresses;
      if (isAdmin) {
        return (allAddresses = await this.addressModel.find());
      }
      console.log(allAddresses, 'allAddresses');
      return (allAddresses = await this.addressModel.find({
        addressOwnerId: userId,
      }));
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    if (!userId) throw new UnauthorizedException();

    try {
      const updated = await this.addressModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          addressOwnerId: new Types.ObjectId(userId),
        },
        { $set: updateAddressDto },
        { new: true },
      );
      if (!updated) {
        throw new NotFoundException('Address not found or not authorized');
      }
      return updated;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} address`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} address`;
  // }
}
