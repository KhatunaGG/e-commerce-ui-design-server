import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AnswerDto, CreateQuestionDto } from './dto/create-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schema/question.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { QueryParamsDto } from 'src/purchase/dto/query-params.dto';


@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionService: Model<Question>,
    private readonly userService: UserService,
  ) {}

  // async create(
  //   userId: Types.ObjectId | string,
  //   createQuestionDto: CreateQuestionDto,
  // ) {
  //   if (!userId)
  //     throw new UnauthorizedException('Please, sign in to write a review');
  //   if (!createQuestionDto) throw new BadGatewayException('NOt a valid data');
  //   try {

  //     const newCreateQuestionDto = {
  //       ...createQuestionDto,
  //       questionOwnerId: userId,

  //       questionOwnerName:
  //     };
  //     const question = await this.questionService.create(newCreateQuestionDto);
  //     // if (question && question._id) {
  //     //   await this.userService.addQuestionToUser(userId, question._id);
  //     // }

  //     return question;
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }

  async create(
    userId: Types.ObjectId | string,
    createQuestionDto: CreateQuestionDto,
  ) {
    if (!userId)
      throw new UnauthorizedException('Please, sign in to write a review');
    if (!createQuestionDto) throw new BadGatewayException('NOt a valid data');
    try {
      const existingUser = await this.userService.findUserById(userId);
      const newCreateQuestionDto = {
        ...createQuestionDto,
        questionOwnerId: userId,

        questionOwnerName: existingUser.yourName,
        questionOwnerLastName: existingUser.lastName,
      };
      const question = await this.questionService.create(newCreateQuestionDto);
      return question;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // async findAll(queryParam: QueryParamsDto) {
  //   try {
  //     const { page, take, countOnly, productId } = queryParam;
  //     const limitedTake = take > 100 ? 100 : take;
  //     const filter = productId ? { productId } : {};
  //     const total = await this.questionService.countDocuments(filter);
  //     if (countOnly) {
  //       return { questionsTotalLength: total };
  //     }
  //     const questions = await this.questionService
  //       .find(filter)
  //       .skip((page - 1) * limitedTake)
  //       .limit(limitedTake);

  //     return {
  //       allQuestions: questions,
  //       questionsTotalLength: total,
  //     };
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  async findAll(queryParam: QueryParamsDto) {
    try {
      const { page, take, countOnly, productId, sort = 'desc' } = queryParam;
      const limitedTake = take > 100 ? 100 : take;
      const filter = productId ? { productId } : {};
      const total = await this.questionService.countDocuments(filter);
      if (countOnly) {
        return { questionsTotalLength: total };
      }
      const questions = await this.questionService
        .find(filter)
        .sort({ createdAt: sort === 'asc' ? 1 : -1 })
        .skip((page - 1) * limitedTake)
        .limit(limitedTake);

      return {
        allQuestions: questions,
        questionsTotalLength: total,
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    userId: Types.ObjectId | string,
    id: string,
    answerDto: AnswerDto,
  ) {
    if (!userId)
      throw new UnauthorizedException('Please, sign in to write a answer');
    if (!answerDto) throw new BadGatewayException('NOt a valid data');
    console.log(answerDto, 'updateQuestionDto');
    const existingUser = await this.userService.findUserById(userId);
    const existingQuestion = await this.questionService.findById(id);
    if (!existingQuestion) throw new BadGatewayException('Question not found');
    try {
      const newAnswer = {
        answerText: answerDto.answerText,
        status: answerDto.status,
        answersOwnerId: existingUser._id,
        answerOwnerLastName: existingUser.yourName,
        answerOwnerName: existingUser.lastName,
      };
      existingQuestion.answers.push(newAnswer);
      const updatedQuestion = await existingQuestion.save();
      const answer =
        updatedQuestion.answers[updatedQuestion.answers.length - 1];
      return answer;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
