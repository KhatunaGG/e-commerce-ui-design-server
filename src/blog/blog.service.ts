import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ArticleDto, CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from './schema/blog.schema';
import { UserService } from 'src/user/user.service';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';

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

  async findAll(queryParam: { page: string; take: string; sort: String }) {
    try {
      const { page, take, sort = 'desc' } = queryParam;
      const limitedTake = Number(take) > 100 ? 100 : Number(take);
      const totalCount = await this.blogService.countDocuments();
      const blogs = await this.blogService
        .find()
        .sort({ createdAt: sort === 'asc' ? 1 : -1 })
        .skip((Number(page) - 1) * limitedTake)
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

  async fetchForArticle() {
    try {
      const topBlogs = await this.blogService
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .lean()
        .exec();

      if (!topBlogs || topBlogs.length === 0) {
        return [];
      }

      const blogsWithUrls = await Promise.all(
        topBlogs.map(async (blog) => {
          const url = await this.awsS3Service.getPresignedUrl(blog.filePath);
          return {
            ...blog,
            filePath: url,
          };
        }),
      );

      return blogsWithUrls;
    } catch (e) {
      console.error('Error:', e);
      throw e;
    }
  }

  async uploadManyFiles(
    userId: string,
    files: { filePath: string; file: Buffer }[],
  ): Promise<string[]> {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    const maxSize = 1 * 1024 * 1024;

    const uploadPromises = files.map(({ filePath, file }) => {
      if (!filePath || !file) {
        throw new BadRequestException('Invalid file input');
      }
      if (file.length > maxSize) {
        throw new BadRequestException(
          'One or more files exceed 1MB size limit',
        );
      }
      return this.awsS3Service.uploadFile(filePath, file);
    });

    try {
      const uploadedPaths = await Promise.all(uploadPromises);
      return uploadedPaths;
    } catch (e) {
      console.log('UploadManyFiles error:', e);
      throw new BadRequestException('Failed to upload all files');
    }
  }

  async update(
    userId: Types.ObjectId | string,
    blogId: Types.ObjectId | string,
    updateBlogDto: UpdateBlogDto,
  ) {
    try {
      if (!userId) {
        throw new UnauthorizedException('User ID is required');
      }
      if (!blogId || !updateBlogDto) {
        throw new BadRequestException();
      }
      const blog = await this.blogService.findById(blogId);
      if (!blog) throw new NotFoundException('Blog not found');
      if (blog.authorId.toString() !== userId.toString()) {
        throw new ForbiddenException('You are not allowed to update this blog');
      }

      if (
        !updateBlogDto.articleTitle ||
        !updateBlogDto.context ||
        !updateBlogDto.filePath ||
        !Array.isArray(updateBlogDto.filePath) ||
        updateBlogDto.filePath.length === 0
      ) {
        throw new BadRequestException('Missing or invalid article data');
      }

      const newArticle: ArticleDto = {
        articleTitle: updateBlogDto.articleTitle,
        context: updateBlogDto.context,
        filePath: updateBlogDto.filePath,
      };

      const updatedBlog = await this.blogService.findByIdAndUpdate(
        blogId,
        { $push: { articles: newArticle } },
        { new: true },
      );
      return { message: 'Article added successfully', blog: updatedBlog };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getBlogById(blogId: Types.ObjectId | string) {
    try {
      if (!blogId) throw new BadRequestException('Blog ID is required');
      const blog = await this.blogService.findById(blogId).lean();

      if (blog && blog.articles.length > 0) {
        const articlesWithPresignedUrls = await Promise.all(
          blog.articles.map(async (article) => {
            const presignedFilePaths = await Promise.all(
              article.filePath.map((path) =>
                this.awsS3Service.getPresignedUrl(path),
              ),
            );

            return {
              ...article,
              filePath: presignedFilePaths,
            };
          }),
        );

        return {
          ...blog,
          articles: articlesWithPresignedUrls,
        };
      }
      return blog;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
