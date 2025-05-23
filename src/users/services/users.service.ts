import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { IUser, IUserService, SearchUserParams } from '../interfaces';
import { User, UserDocument } from '../models';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new this.UserModel(data);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.UserModel.findById(id).select('-__v').exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.UserModel.findOne({ email: email }).select('-__v').exec();
  }
  async findAll(params: SearchUserParams): Promise<IUser[] | null> {
    const users = await this.UserModel.find({
      name: { $regex: params.name, $options: 'i' },
      email: { $regex: params.email, $options: 'i' },
      contactPhone: { $regex: params.contactPhone, $options: 'i' },
    })
      .select('-__v')
      .exec();

    if (params.limit > 0) {
      return users.slice(
        params.offset > 0 ? params.offset - 1 : 0,
        params.offset > 0 ? params.limit + params.offset - 1 : params.limit - 1,
      );
    }
    return users.slice(params.offset > 0 ? params.offset - 1 : 0);
  }
}
