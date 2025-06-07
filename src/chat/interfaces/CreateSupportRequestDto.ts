import { ObjectId } from 'mongoose';

export interface CreateSupportRequestDto {
  user: ObjectId | string;
  text: string;
}
