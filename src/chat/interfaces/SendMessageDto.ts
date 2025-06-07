import { ObjectId } from 'mongoose';

export interface SendMessageDto {
  author: ObjectId | string;
  supportRequest: ObjectId | string;
  text: string;
}
