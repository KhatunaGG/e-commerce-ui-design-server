import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { password, email } = createUserDto;
      const existingUser = await this.usersService.findOne({ email });
      if (existingUser) throw new BadRequestException('User already exist');
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        ...createUserDto,
        password: hashedPassword,
      };
      await this.usersService.create(newUser);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async signIn(signInDto: SignInDto) {
    console.log(signInDto, 'signInDto');
    try {
      const { userName, email, password, rememberMe } = signInDto;
      if (!password || (!userName && !email)) {
        throw new BadRequestException(
          'Invalid credentials: email or username and password are required',
        );
      }
      let existingUser;
      if (userName) {
        existingUser = await this.usersService.findOne({ userName });
      } else if (email) {
        existingUser = await this.usersService.findOne({ email });
      }
      if (!existingUser) throw new BadRequestException('Invalid credentials');
      const isPasswordEqual = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordEqual)
        throw new BadRequestException('Invalid credentials');
      const payload = {
        sub: existingUser._id,
        role: existingUser.role,
      };
      const expire = rememberMe === true ? '7d' : 60 * 60;
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: expire,
      });
      return { accessToken };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getCurrentUser(userId: Types.ObjectId | string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      const currentUser = await this.usersService.getById(userId);
      return currentUser;
    } catch (error) {
      console.log(error);
    }
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
