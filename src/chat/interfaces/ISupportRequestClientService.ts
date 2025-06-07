import { ObjectId } from 'mongoose';

import { CreateSupportRequestDto } from './';
import { MarkMessagesAsReadDto } from './';

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ObjectId | string): Promise<Message[]>;
}
