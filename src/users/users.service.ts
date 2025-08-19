import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { IUserService, ISearchUserParams, IUser } from './interfaces';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: IUser): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User email must be unique');
    }
    const newUser = new User(data);
    const user = new this.UserModel(newUser);
    return await user.save();
  }

  async findById(id: string): Promise<User | null> {
    return await this.UserModel.findById(id).select('-__v').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.UserModel.findOne({ email: email }).select('-__v').exec();
  }

  escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  async findAll(params: ISearchUserParams): Promise<User[] | null> {
    const users = await this.UserModel.find({
      name: { $regex: this.escapeRegExp(params.name), $options: 'i' },
      email: { $regex: this.escapeRegExp(params.email), $options: 'i' },
      contactPhone: {
        $regex: this.escapeRegExp(params.contactPhone),
        $options: 'i',
      },
    })
      .select('-__v')
      .exec();
    const limit = params.limit ? params.limit : users.length;
    return users.slice(params.offset, Number(limit) + Number(params.offset));
  }
}
