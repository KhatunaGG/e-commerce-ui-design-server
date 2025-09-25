import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto, ReplyDto } from './dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { QueryParamsDto } from 'src/purchase/dto/query-params.dto';

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

  async findAll(queryParam: QueryParamsDto) {
    try {
      const { page, take, countOnly, sort = 'desc', productId } = queryParam;
      const filter = productId ? { productId } : {};
      const totalReviews = await this.reviewService.countDocuments(filter);

      if (countOnly) {
        return { reviewsTotalLength: totalReviews };
      }

      const limitedTake = take > 100 ? 100 : take;
      const reviews = await this.reviewService
        .find(filter)
        .sort({ createdAt: sort === 'asc' ? 1 : -1 })
        .skip((page - 1) * limitedTake)
        .limit(limitedTake);

      let totalRating = 0;

      if (productId) {
        const allProductReviews = await this.reviewService.find({ productId });

        let totalSum = 0;
        let totalCount = 0;

        for (const review of allProductReviews) {
          for (const rated of review.ratedBy) {
            totalSum += rated.rating;
            totalCount++;
          }
        }
        totalRating =
          totalCount === 0 ? 0 : Math.round((totalSum / totalCount) * 10) / 10;
      }

      return {
        reviews,
        reviewsTotalLength: totalReviews,
        totalRating,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

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
        replyOwnerName: existingUserName ? existingUserName : '',
        replyOwnerLastName: existingUserLastName ? existingUserLastName : '',
        _id: new Types.ObjectId(),

        ratedBy: replyDto.ratedBy.map((rate) => ({
          ratedById: new Types.ObjectId(rate.ratedById),
          rating: rate.rating,
        })),
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

  async updateReviewRating(
    userId: Types.ObjectId | string,
    reviewId: Types.ObjectId | string,
    rate: number,
  ) {
    try {
      const review = await this.reviewService.findById(reviewId);
      if (!review) throw new NotFoundException('Review not found');
      const userObjectId = new Types.ObjectId(userId);
      const alreadyRated = review.ratedBy.some((r) =>
        userObjectId.equals(r.ratedById),
      );
      if (alreadyRated) {
        throw new BadRequestException('You already rated this review');
      }
      review.ratedBy.push({
        ratedById: userObjectId,
        rating: rate,
      });
      await review.save();
      const allReviews = await this.reviewService.find({
        productId: review.productId,
      });

      let totalSum = 0;
      let totalCount = 0;

      for (const r of allReviews) {
        for (const rated of r.ratedBy) {
          totalSum += rated.rating;
          totalCount++;
        }
      }
      const averageRating =
        totalCount === 0 ? 0 : Math.round((totalSum / totalCount) * 10) / 10;
      return {
        review,
        totalRating: averageRating,
        reviewsTotalLength: allReviews.length,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateReplyRate(
    userId: Types.ObjectId | string,
    reviewId: Types.ObjectId | string,
    replyId: Types.ObjectId | string,
    rate: number,
  ) {
    if (!isValidObjectId(reviewId)) {
      throw new BadRequestException('Invalid reviewId');
    }
    if (!isValidObjectId(replyId)) {
      throw new BadRequestException('Invalid replyId');
    }
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const objectReviewId = new Types.ObjectId(reviewId);
    const objectReplyId = new Types.ObjectId(replyId);
    const objectUserId = new Types.ObjectId(userId);

    try {
      const review = await this.reviewService.findById(objectReviewId);
      if (!review) {
        throw new NotFoundException('Review not found');
      }
      const reply = review.replies.find(
        (r) => r._id.toString() === objectReplyId.toString(),
      );
      if (!reply) {
        throw new NotFoundException('Reply not found');
      }
      const alreadyRated = reply.ratedBy.some(
        (r) => r.ratedById.toString() === objectUserId.toString(),
      );
      if (alreadyRated) {
        throw new BadRequestException('You have already rated this reply.');
      }
      reply.ratedBy.push({
        ratedById: objectUserId,
        rating: rate,
      });
      const total = reply.ratedBy.reduce((sum, r) => sum + r.rating, 0);
      reply.rating = total / reply.ratedBy.length;
      await review.save();
      return {
        updatedReply: reply,
        reviewId: review._id,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAverageRating(productId: string): Promise<number> {
    try {
      const reviews = await this.reviewService.find({ productId });
      const allRatings: number[] = reviews.flatMap((review) =>
        (review.ratedBy || []).map((ratedByEntry) => ratedByEntry.rating),
      );
      if (allRatings.length === 0) return 0;
      const total = allRatings.reduce((sum, r) => sum + r, 0);
      const average = total / allRatings.length;
      return Math.round(average * 10) / 10;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateReviewsLikes(userId: Types.ObjectId | string, reviewId: string) {
    if (!userId)
      throw new UnauthorizedException('Please, sign in to like a review');
    try {
      const review = await this.reviewService.findById(reviewId);
      if (!review) {
        throw new NotFoundException('Review not found');
      }
      if (!Array.isArray(review.likes)) {
        review.likes = [];
      }
      const existingLikesIndex = review.likes.findIndex(
        (like) => like?.likedById?.toString() === userId.toString(),
      );
      if (existingLikesIndex !== -1) {
        review.likes.splice(existingLikesIndex, 1);
      } else {
        review.likes.push({
          likedById: new Types.ObjectId(userId),
          like: 1,
        });
      }
      const updatedReview = await this.reviewService.findByIdAndUpdate(
        reviewId,
        { likes: review.likes },
        { new: true },
      );
      return {
        message: 'Like updated successfully',
        likes: updatedReview.likes,
        reviewId: updatedReview._id,
      };
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
