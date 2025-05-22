import { SearchUserParams, IUser } from '../interfaces';

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: SearchUserParams): Promise<IUser[]>;
}
