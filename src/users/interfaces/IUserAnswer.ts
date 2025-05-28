import { ObjectId } from 'mongoose';
export interface IUserAnswer {
  id: ObjectId | string;
  email: string;
  name: string;
  contactPhone?: string;
  role?: string;
}
