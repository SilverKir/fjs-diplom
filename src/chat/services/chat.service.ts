import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ObjectId, Model, Connection } from 'mongoose';

import {
  ISupportRequestService,
  GetChatListParams,
  SendMessageDto,
} from '../interfaces';
import {
  SupportRequest,
  Message,
  SupportRequestDocument,
  MessageDocument,
} from '../models';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private requestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    return await this.requestModel
      .find({ user: params.user }, { isActive: params.isActive })
      .exec()
      .catch(() => {
        throw new BadRequestException('Wrong GetChatListParams');
      });
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const message = new this.messageModel({
      author: data.author,
      sentAt: new Date(),
      text: data.text,
    });
    const newMessage = await message.save();
    const request = await this.requestModel
      .findById(data.supportRequest)
      .catch(() => {
        throw new BadRequestException('Wrong RequestId');
      });
    if (request) {
      request.messages.push(newMessage);
      await request.save();
    }
    return newMessage;
  }

  async getMessages(supportRequest: ObjectId | string): Promise<Message[]> {
    const request = await this.requestModel.findById(supportRequest);
    if (request) {
      return request.messages;
    }
    return [];
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }
}
