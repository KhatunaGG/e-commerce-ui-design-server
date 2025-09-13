import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto, ReplyDto } from './dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewService: Model<Review>,
    private readonly userService: UserService,
  ) {}
  async create(
    userId: Types.ObjectId | string,
    createReviewDto: CreateReviewDto,
  ) {
    if (!userId)
      throw new UnauthorizedException('Please, sign in to write a review');
    try {
      if (!createReviewDto) throw new BadRequestException();
      const newReview = {
        ...createReviewDto,
        reviewOwnerId: userId,
      };
      const review = await this.reviewService.create(newReview);
      if (review && review._id) {
        await this.userService.addReviewToUser(userId, review._id);
      }
      return review;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  findAll() {
    const allReviews = this.reviewService.find();
    return allReviews;
  }

  // async updateReviewWithReplay(
  //   userId: Types.ObjectId | string,
  //   id: Types.ObjectId | string,
  //   replyDto: ReplyDto,
  // ) {
  //   if (!userId)
  //     throw new UnauthorizedException('Please, sign in to write a review');

  //   if (!id || !replyDto) {
  //     throw new BadRequestException('No parameters to reply to the review');
  //   }
  //   try {
  //     const existingReview = await this.reviewService.findById(id);
  //     const existingUser = await this.userService.findUserById(userId);

  //     if (!existingReview) {
  //       throw new NotFoundException('Review not found');
  //     }
  //     const updatedDto = {
  //       ...replyDto,
  //       userName: existingUser.yourName,
  //       lastName: existingUser.lastName,
  //       filePath: existingUser.filePath,
  //     };

  //     console.log(updatedDto, 'updatedDto from service');
  //     existingReview.replies.push(replyDto);
  //     // const updatedReview = await existingReview.save();
  //     // return updatedReview;

  //     const updatedReview = await existingReview.save();
  //     const newReply = updatedReview.replies[updatedReview.replies.length - 1];
  //     return newReply;
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }

  async updateReviewWithReplay(
    userId: Types.ObjectId | string,
    id: Types.ObjectId | string,
    replyDto: ReplyDto,
  ) {
    if (!userId)
      throw new UnauthorizedException('Please, sign in to write a review');

    if (!id || !replyDto) {
      throw new BadRequestException('No parameters to reply to the review');
    }
    try {
      const existingReview = await this.reviewService.findById(id);
      const existingUser = await this.userService.findUserById(userId);
      if (!existingReview) {
        throw new NotFoundException('Review not found');
      }
      const existingUserName = existingUser.yourName;
      const existingUserLastName = existingUser.lastName;

      const updatedDto = {
        ...replyDto,
        userName: existingUser.yourName,
        lastName: existingUser.lastName,
        filePath: existingUser.filePath,
        // replyToReviewOwnerId: existingReview.reviewOwnerId, //??
        replyOwnerName: existingUserName ? existingUserName : '',
        replyOwnerLastName: existingUserLastName ? existingUserLastName : '',
      };
      existingReview.replies.push(updatedDto);
      const updatedReview = await existingReview.save();
      const newReply = updatedReview.replies[updatedReview.replies.length - 1];
      return newReply;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
