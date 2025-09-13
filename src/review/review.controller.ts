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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReplyDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('review')
// @UseGuards(AuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.userId, createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  // @Patch(':id/update-reply')
  @Patch('update-reply/:id')
  @UseGuards(AuthGuard)
  updateReplayWithReview(
    @Req() req,
    @Param('id') id: string,
    @Body() replyDto: ReplyDto,
  ) {
    return this.reviewService.updateReviewWithReplay(req.userId, id, replyDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
