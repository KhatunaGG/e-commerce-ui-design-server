import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from './schema/blog.schema';
import { UserService } from 'src/user/user.service';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
// import { QueryParamsDto } from './dto/query-params.dto';
import { QueryParamsDto } from 'src/product/dto/query-params.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogService: Model<Blog>,
    private readonly usersService: UserService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async create(userId: Types.ObjectId | string, createBlogDto: CreateBlogDto) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    try {
      const existingUser = await this.usersService.findUserById(userId);
      if (!existingUser) throw new NotFoundException('User not found');
      const updatedDto = {
        ...createBlogDto,
        authorFName: existingUser.yourName,
        authorLName: existingUser.lastName,
        authorId: userId,
      };
      console.log(updatedDto, 'updatedDto');
      const newBlog = await this.blogService.create(updatedDto);
      return newBlog;
    } catch (e) {
      console.log('Error-massage:', e);
      throw e;
    }
  }

  async uploadImage(userId: string, filePath: string, file: Buffer) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    const maxSize = 1 * 1024 * 1024;
    if (file.length > maxSize) {
      throw new BadRequestException('File size should not exceed 1MB');
    }
    console.log(file);

    try {
      const uploadedPath = await this.awsS3Service.uploadFile(filePath, file);
      return uploadedPath;
    } catch (e) {
      console.log('Upload error:', e);
      throw e;
    }
  }

  async findAll(queryParam: QueryParamsDto) {
    try {
      const { page, take, sortBy = 'desc' } = queryParam;
      const limitedTake = take > 100 ? 100 : take;
      const totalCount = await this.blogService.countDocuments();
      const blogs = await this.blogService
        .find()
        .sort({ createdAt: sortBy === 'oldest' ? 1 : -1 })
        .skip((page - 1) * limitedTake)
        .limit(limitedTake)
        .lean();

      if (!blogs.length) return [];
      const updatedBlogs = await Promise.all(
        blogs.map(async (blog) => {
          const url = await this.awsS3Service.getImageById(blog.filePath);
          return { ...blog, filePath: url };
        }),
      );
      return {
        updatedBlogs,
        totalCount,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
