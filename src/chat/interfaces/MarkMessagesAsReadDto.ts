import { ObjectId } from 'mongoose';

export interface MarkMessagesAsReadDto {
  user: ObjectId | string;
  supportRequest: ObjectId | string;
  createdBefore: Date;
}
