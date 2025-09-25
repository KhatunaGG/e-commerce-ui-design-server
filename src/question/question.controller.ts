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
import { QuestionService } from './question.service';
import { AnswerDto, CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { QueryParamsDto } from 'src/purchase/dto/query-params.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(req.userId, createQuestionDto);
  }

  @Get()
  findAll(@Query() queryParam: QueryParamsDto) {
    return this.questionService.findAll(queryParam);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateQuestionDto: AnswerDto,
  ) {
    return this.questionService.update(req.userId, id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
