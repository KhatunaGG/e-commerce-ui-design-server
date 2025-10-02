import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBlogDto } from './dto/create-blog.dto';
import { QueryParamsDto } from 'src/product/dto/query-params.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Patch('/upload-file')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // console.log(file, "file from controller")
    const path = Math.random().toString().slice(2);
    const filePath = `e-commerce-ui-design/${path}`;
    return this.blogService.uploadImage(req.userId, filePath, file.buffer);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(req.userId, createBlogDto);
  }

  @Get()
  findAll(@Query() queryParam: QueryParamsDto) {
    return this.blogService.findAll(queryParam);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
