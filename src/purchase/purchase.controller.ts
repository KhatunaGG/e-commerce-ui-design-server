import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createPurchaseDto: CreatePurchaseDto) {
    console.log(createPurchaseDto, 'createPurchaseDto');
    return this.purchaseService.create(req.userId, req.role, createPurchaseDto);
  }

  // @Get()
  // @UseGuards(AuthGuard)
  // findAll() {
  //   return this.purchaseService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchaseService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePurchaseDto: UpdatePurchaseDto,
  // ) {
  //   return this.purchaseService.update(+id, updatePurchaseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.purchaseService.remove(+id);
  // }
}
