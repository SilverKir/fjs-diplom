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

  findById(id: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  findAll(params: SearchUserParams): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }
}
