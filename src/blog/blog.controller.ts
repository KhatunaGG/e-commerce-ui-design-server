import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
  BadRequestException,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateBlogDto } from './dto/create-blog.dto';

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
  findAll(@Query() queryParam: { page: string; take: string; sort: String }) {
    return this.blogService.findAll(queryParam);
  }

  @Post('upload-many')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMany(@UploadedFiles() files: Express.Multer.File[], @Req() req) {
    const fileForUpload = files.map((file, index) => ({
      filePath: `e-commerce-ui-design/${Math.random().toString().slice(2)}`,
      file: file.buffer,
    }));

    const uploadedPaths = await this.blogService.uploadManyFiles(
      req.userId,
      fileForUpload,
    );
    return {
      message: 'Files uploaded successfully',
      uploadedPaths,
    };
  }

  @Patch('/:blogId/add-article')
  @UseGuards(AuthGuard)
  update(
    @Req() req,
    @Param('blogId') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(req.userId, blogId, updateBlogDto);
  }

  @Get('/get-for-articles')
  fetchForArticle() {
    return this.blogService.fetchForArticle();
  }

  @Get(':blogId')
  getBlogById(@Param('blogId') blogId: string) {
    return this.blogService.getBlogById(blogId);
  }
}
