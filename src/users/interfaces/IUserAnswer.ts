import { Role } from '../users.roles.enum';
export interface IUserAnswer {
  id: string;
  email: string;
  name: string;
  contactPhone?: string;
  role?: Role;
}
