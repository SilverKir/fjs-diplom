import { ISearchUserParams, IUser } from '../interfaces';
import { User } from '../users.models';

export interface IUserService {
  create(data: Partial<IUser>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(params: ISearchUserParams): Promise<User[] | null>;
}
