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
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReplyDto } from './dto/create-review.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { QueryParamsDto } from 'src/purchase/dto/query-params.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.userId, createReviewDto);
  }

  @Get()
  findAll(@Query() queryParam: QueryParamsDto) {
    return this.reviewService.findAll(queryParam);
  }

  @Patch('update-reply/:id')
  @UseGuards(AuthGuard)
  updateReplayWithReview(
    @Req() req,
    @Param('id') id: string,
    @Body() replyDto: ReplyDto,
  ) {
    return this.reviewService.updateReviewWithReplay(req.userId, id, replyDto);
  }

  @Patch('/update-rate/:reviewId')
  @UseGuards(AuthGuard)
  updateRate(
    @Req() req,
    @Param('reviewId') reviewId: string,
    @Body() { rating }: { rating: number },
  ) {
    return this.reviewService.updateReviewRating(req.userId, reviewId, rating);
  }

  @Patch('/update-reply-rate')
  @UseGuards(AuthGuard)
  updateReplyRate(
    @Req() req,
    @Query('reviewId') reviewId: string,
    @Query('replyId') replyId: string,
    @Query('productId') productId: string,
    @Body() { rating }: { rating: number },
  ) {
    return this.reviewService.updateReplyRate(
      req.userId,
      reviewId,
      replyId,
      rating,
    );
  }

  @Get('average-rating/:productId')
  async getAverageRating(@Param('productId') productId: string) {
    const averageRating = await this.reviewService.getAverageRating(productId);
    return { averageRating };
  }

  @Patch('/:id/like')
  @UseGuards(AuthGuard)
  async updateReviewsLikes(@Req() req, @Param('id') reviewId: string) {
    return await this.reviewService.updateReviewsLikes(req.userId, reviewId);
  }
}
