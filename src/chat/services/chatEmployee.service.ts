import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { ObjectId, Model, Connection } from 'mongoose';

import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from '../interfaces';
import {
  SupportRequest,
  Message,
  SupportRequestDocument,
  MessageDocument,
} from '../models';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private requestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

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
      .catch(() => {
        throw new BadRequestException('Wrong RequestID');
      });
    if (request) {
      return request.messages.filter(
        (el) => String(el.author._id) == String(request.user._id) && !el.readAt,
      );
    }
    return [];
  }

  async closeRequest(supportRequest: ObjectId | string): Promise<void> {
    await this.requestModel
      .updateOne({ _id: supportRequest }, { $set: { isActive: false } })
      .exec()
      .catch(() => {
        throw new BadRequestException('Wrong markMessageParams');
      });
  }
}
