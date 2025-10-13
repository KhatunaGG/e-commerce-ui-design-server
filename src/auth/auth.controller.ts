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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guard/auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { retry } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  gerCurrentUser(@Req() req) {
    return this.authService.getCurrentUser(req.userId);
  }

  @Patch('update')
  @UseGuards(AuthGuard)
  updateUsersAccount(@Req() req, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.updateUsersAccount(req.userId, updateAuthDto);
  }

  @Patch('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUsersAvatar(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const path = Math.random().toString().slice(2);
    const filePath = `e-commerce-ui-design/${path}`;
    return await this.authService.uploadImage(
      filePath,
      file.buffer,
      req.userId,
    );
  }

  @Get('get-image')
  @UseGuards(AuthGuard)
  async getUsersAvatar(@Req() req) {
    return await this.authService.getUsersAvatar(req.userId);
  }

  @Post('contact')
  @UseGuards(AuthGuard)
  async sendContactEmail(
    @Req() req,
    @Body() body: { fullName: string; yourEmail: string; message: string },
  ) {
    const { fullName, yourEmail, message } = body;
    return await this.authService.sendContactEmail(
      req.userId,
      fullName,
      yourEmail,
      message,
    );
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
