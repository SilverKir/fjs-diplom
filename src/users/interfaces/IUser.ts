import { Role } from '../users.roles.enum';

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  contactPhone?: string;
  role: Role;
}
