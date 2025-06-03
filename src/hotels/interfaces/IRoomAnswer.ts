import { ObjectId } from 'mongoose';
export interface IRoomAnswer {
  id: ObjectId | string;
  description?: string;
  images?: string[];
  isEnabled: boolean;
  hotel: {
    id: ObjectId | string;
    title: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
