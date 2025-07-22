import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { CreateUtilityDto } from './dto/create-utility.dto';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  @Post()
  create(@Body() createUtilityDto: CreateUtilityDto) {
    console.log(createUtilityDto, "createUtilityDto")
    return this.utilitiesService.create(createUtilityDto);
  }

  @Get('by-page')
  async getAllImages(@Query('page') page: string) {
    return await this.utilitiesService.getUtilitiesByPage(page);
  }

  
  // @Get('by-page')
  // async getImageByPage(@Query('page') page: string) {
  //   return this.utilitiesService.findImageByPage(page);
  // }

  // @Get('by-page')
  // async getUtilitiesByPage(@Query() query: string) {
  //   const images = await this.utilitiesService.getUtilitiesByPage(query);
  //   return images;
  // }

  // @Get('by-page')
  // async getUtilities(@Query() query: CreateUtilityDto) {
  //   const images = await this.utilitiesService.findFiltered(query);
  //   return images;
  // }

  // @Get()
  // findAll() {
  //   return this.utilitiesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.utilitiesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUtilityDto: UpdateUtilityDto) {
  //   return this.utilitiesService.update(+id, updateUtilityDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.utilitiesService.remove(+id);
  // }
}
