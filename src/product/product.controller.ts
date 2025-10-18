import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { Types } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAllByQueryParams(@Query() queryParams: QueryParamsDto) {
    return this.productService.findAllByQueryParams(queryParams);
  }
  @Get('all-whishList')
  findAllWishList(@Query() queryParams: QueryParamsDto) {
    return this.productService.findAllWishList(queryParams);
  }

  @Get('new-arrivals')
  async getNewArrivals() {
    return await this.productService.findNewArrivals();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log('PATCH /product/:id called with', updateProductDto);
    const prod = await this.productService.update(id, updateProductDto);
    console.log('Completed update, returning', prod);
    return prod;
  }
}
