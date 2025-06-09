import { ObjectId } from 'mongoose';

import { CreateSupportRequestDto } from './';
import { MarkMessagesAsReadDto } from './';
import { SupportRequest, Message } from '../models';

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ObjectId | string): Promise<Message[]>;
}
