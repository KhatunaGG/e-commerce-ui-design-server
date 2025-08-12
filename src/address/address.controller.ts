import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create-address')
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createAddressDto: CreateAddressDto) {
    console.log(createAddressDto, 'createAddressDto');
    return this.addressService.create(req.userId, createAddressDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    const isAdmin = req.role === Role.ADMIN;
    return this.addressService.findAll(req.userId, isAdmin);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
        console.log(req.userId, "userId")
    console.log(id, "id")
    console.log(updateAddressDto, "updateAddressDto")
    return this.addressService.update(req.userId, id, updateAddressDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.addressService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.addressService.remove(+id);
  // }
}
