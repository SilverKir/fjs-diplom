import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ObjectId, Model, Connection } from 'mongoose';

import {
  CreateSupportRequestDto,
  ISupportRequestClientService,
  MarkMessagesAsReadDto,
} from '../interfaces';
import {
  SupportRequest,
  Message,
  SupportRequestDocument,
  MessageDocument,
} from '../models';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private requestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const message = new this.messageModel({
      author: data.user,
      sentAt: new Date(),
      text: data.text,
    });
    const newMessage = await message.save();
    const newRequest = new this.requestModel({
      user: data.user,
      messages: [newMessage],
      isActive: true,
    });
    return await newRequest.save();
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const messages = await this.getUnreadCount(params.supportRequest);
    if (messages.length > 0) {
      messages.map((el) => {
        if (el.sentAt < params.createdBefore) {
          this.messageModel
            .updateOne({ _id: el._id }, { $set: { readAt: new Date() } })
            .exec()
            .catch(() => {
              throw new BadRequestException('Wrong markMessageParams');
            });
        }
      });
    }
  }

  async getUnreadCount(supportRequest: ObjectId | string): Promise<Message[]> {
    const request: SupportRequest | null = await this.requestModel
      .findById(supportRequest)
      .populate('messages')
      .catch(() => {
        throw new BadRequestException('Wrong RequestID');
      });
    if (request) {
      return request.messages.filter(
        (el) =>
          String(el.author._id) !== String(request.user._id) && !el.readAt,
      );
    }
    return [];
  }
}
