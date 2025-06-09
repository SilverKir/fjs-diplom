import { ObjectId } from 'mongoose';

import { MarkMessagesAsReadDto } from './';
import { Message } from '../models';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ObjectId | string): Promise<Message[]>;
  closeRequest(supportRequest: ObjectId | string): Promise<void>;
}
