import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(req.userId, req.role, createPurchaseDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req, @Query() queryParam: QueryParamsDto) {
    return this.purchaseService.findAll(req.userId, req.role, queryParam);
  }
}
