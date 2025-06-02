import { ObjectId } from 'mongoose';
export interface IHotelAnswer {
  id: ObjectId | string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
