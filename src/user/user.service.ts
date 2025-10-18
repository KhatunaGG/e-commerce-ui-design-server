import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  getById(id: Types.ObjectId | string) {
    return this.userModel.findById(id).select('+password');
  }

  async findUserAndUpdate(id: Types.ObjectId | string, newPurchase) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { $push: { orders: newPurchase._id } },
        { new: true },
      );
      return updatedUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateUsersAccount(userId, updateAuthDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.userModel
        .findByIdAndUpdate(user._id, updateAuthDto, { new: true })
        .select('-password');
      return updatedUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  findOne(query) {
    return this.userModel.findOne(query);
  }

  async uploadUsersAvatar(userId, filePathFromAws) {
    try {
      const existingUser = await this.userModel.findById(userId);
      if (!existingUser) throw new NotFoundException('User not found');
      const updatedUser = await this.userModel.findByIdAndUpdate(
        existingUser._id,
        { filePath: filePathFromAws },
        { new: true },
      );
      return updatedUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addReviewToUser(
    userId: Types.ObjectId | string,
    reviewId: Types.ObjectId,
  ) {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.reviews.push(reviewId);
      await user.save();
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findUserById(id: Types.ObjectId | string) {
    try {
      return await this.userModel.findById(id).select('-password');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
