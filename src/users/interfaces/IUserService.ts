import { SearchUserParams, IUser } from '../interfaces';
import { User } from '../models';

export interface IUserService {
  create(data: Partial<IUser>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(params: SearchUserParams): Promise<User[] | null>;
}
