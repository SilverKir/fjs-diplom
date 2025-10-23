import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    private chatEmitter: EventEmitter2,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    type Query = { user?: ObjectId | string; isActive: boolean };
    const query: Query = { isActive: params.isActive };
    if (params.user) {
      query.user = params.user;
    }
    return await this.requestModel
      .find(query)
      .populate('user')
      .select('-__v')
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
    const request = await this.requestModel
      .findById(data.supportRequest)
      .catch(() => {
        throw new BadRequestException('Wrong RequestId');
      });
    const newMessage = await message.save();
    if (request) {
      request.messages.push(newMessage);
      await request.save();
    }

    return newMessage;
  }

  async getMessages(supportRequest: ObjectId | string): Promise<Message[]> {
    const result = await this.requestModel
      .findById(supportRequest)
      .populate({ path: 'messages', populate: { path: 'author' } })
      .exec();
    if (!result) return [];

    return result.messages;
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    return () => {
      this.chatEmitter.on('newMessage', ({ supportRequest, message }) => {
        handler(supportRequest, message);
      });
    };
  }

  async validate(
    supportRequest: ObjectId | string,
    user: ObjectId | string,
    role: string,
  ): Promise<void> {
    if (role == 'manager') return;
    const request = await this.requestModel.findById(supportRequest);
    if (!request) {
      throw new BadRequestException('Invalid request');
    }
    if (user.toString() !== request.user.toString()) {
      throw new ForbiddenException('Wrong user');
    }
  }
}
