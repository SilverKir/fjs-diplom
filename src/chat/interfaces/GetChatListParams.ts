import { ObjectId } from 'mongoose';

export interface GetChatListParams {
  user: ObjectId | string | null;
  isActive: boolean;
}
