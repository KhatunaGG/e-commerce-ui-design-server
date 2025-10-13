import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { Types } from 'mongoose';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { toArray } from 'rxjs';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private jwtService: JwtService,
    private awsS3Service: AwsS3Service,
    private readonly emailService: EmailSenderService,
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
      if (!existingUser) {
        throw new BadRequestException('Invalid credentials');
      }
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
      if (!currentUser) {
        throw new UnauthorizedException('User not found');
      }
      return currentUser;
    } catch (error) {
      console.log(error);
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('Failed to get current user');
    }
  }

  async findUserAndUpdate(id: Types.ObjectId | string, newPurchase) {
    if (!id) {
      throw new UnauthorizedException('User ID is required.');
    }
    try {
      return await this.usersService.findUserAndUpdate(id, newPurchase);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateUsersAccount(userId: string, updateUserDto: any) {
    if (!userId) throw new UnauthorizedException();
    try {
      // const user = await this.usersService.getById(userId);
      const user = await this.usersService.findUserById(userId);

      if (!user) throw new NotFoundException('User not found');
      const { oldPassword, newPassword, confirmPassword, ...otherUpdates } =
        updateUserDto;
      const wantsToChangePassword =
        oldPassword || newPassword || confirmPassword;

      if (wantsToChangePassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          throw new BadRequestException(
            'All password fields are required to update password',
          );
        }

        if (newPassword !== confirmPassword) {
          throw new BadRequestException(
            'New password and confirmation do not match',
          );
        }
        const isOldPasswordValid = await bcrypt.compare(
          oldPassword,
          user.password,
        );
        if (!isOldPasswordValid) {
          throw new BadRequestException('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        otherUpdates.password = hashedPassword;
      }
      delete otherUpdates.oldPassword;
      delete otherUpdates.confirmPassword;
      delete otherUpdates.newPassword;
      const updatedUser = await this.usersService.updateUsersAccount(
        userId,
        otherUpdates,
      );

      return updatedUser;
    } catch (e) {
      console.error('Failed to update user account:', e);
      throw e;
    }
  }

  async uploadImage(filePath: string, file: Buffer, userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    const maxSize = 500 * 1024;
    if (file.length > maxSize) {
      throw new BadRequestException(
        'Avatar file size should not exceed 500 KB',
      );
    }
    try {
      const existingUser = await this.usersService.findUserById(userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const oldFilePath = existingUser.filePath;
      const newPath = await this.awsS3Service.uploadFile(filePath, file);
      const updatedUser = await this.usersService.uploadUsersAvatar(
        userId,
        newPath,
      );
      if (oldFilePath && oldFilePath !== newPath) {
        try {
          const removedOldPath =
            await this.awsS3Service.deleteImageByFileId(oldFilePath);
        } catch (deleteError) {
          console.error('Error deleting old file (non-critical):', deleteError);
        }
      } else {
        console.log('No old file to delete or same path');
      }
      return updatedUser;
    } catch (e) {
      console.error('Upload error:', e);
      throw e;
    }
  }

  async getUsersAvatar(userId) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    try {
      const user = await this.usersService.findUserById(userId);
      if (!user) throw new NotFoundException('User not found');

      if (!user.filePath) {
        return { avatar: null };
      }
      const filePath = user.filePath;
      try {
        const image = await this.awsS3Service.getImageById(filePath);
        // console.log('image-avatar:', image?.substring(0, 50));
        return { avatar: image };
      } catch (e) {
        if (
          e?.$metadata?.httpStatusCode === 404 ||
          e instanceof NotFoundException
        ) {
          return { avatar: null };
        }
        throw e;
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async sendContactEmail(
    userId: Types.ObjectId | string,
    fullName: string,
    yourEmail: string,
    message: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    try {

      if (!fullName || !yourEmail || !message) {
        throw new BadRequestException('Missing required fields');
      }
      const mailSender =await this.usersService.findUserById(userId)
      return await this.emailService.sendEmail( yourEmail, message, mailSender.yourName, mailSender.lastName, mailSender.email );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
