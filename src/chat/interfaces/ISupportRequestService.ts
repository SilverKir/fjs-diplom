import { ObjectId } from 'mongoose';

import { GetChatListParams } from './';
import { SendMessageDto } from './';
import { SupportRequest, Message } from '../models';

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ObjectId | string): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}
