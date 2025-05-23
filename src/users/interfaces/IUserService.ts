import { SearchUserParams, IUser } from '../interfaces';

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findAll(params: SearchUserParams): Promise<IUser[] | null>;
}
