import { Controller, Request, Get, Param, Post, Body } from '@nestjs/common';

import {
  SupportRequestClientService,
  SupportRequestEmployeeService,
  SupportRequestService,
} from '../services';
import { Roles } from 'src/auth';
import { Role } from 'src/users';
import { MessageAnswer, SendMessageDto } from '../interfaces';
import { ChatDto, ReadDto } from '../dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('api/common/support-requests')
export class ChatCommonController {
  constructor(
    private managerService: SupportRequestEmployeeService,
    private chatService: SupportRequestService,
    private clientServise: SupportRequestClientService,
    private chatEmitter: EventEmitter2,
  ) {}

  /**
   * получение менеджером и клиентом списка сообщений в чате
   * @param req
   * @param id
   * @returns
   */
  @Roles(Role.Manager, Role.Client)
  @Get(':id/messages')
  async getMessagesHistory(
    @Request() req,
    @Param('id') id: string,
  ): Promise<MessageAnswer[]> {
    await this.chatService.validate(id, req.user._id, req.user.role);
    const result = await this.chatService.getMessages(id);
    const promises = result.map((el) => {
      return {
        id: String(el._id),
        createdAt: el.createdAt.toISOString(),
        text: el.text,
        readAt: el.readAt ? el.readAt.toISOString() : '',
        author: { id: String(el.author._id), name: el.author.name },
      };
    });
    return Promise.all(promises);
  }

  /**
   * отправка клиентом и менеджером сообщений в чат
   * @param req
   * @param id
   * @param data
   * @returns
   */
  @Roles(Role.Manager, Role.Client)
  @Post(':id/messages')
  async postMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() data: ChatDto,
  ): Promise<MessageAnswer[]> {
    await this.chatService.validate(id, req.user._id, req.user.role);
    const messageData: SendMessageDto = {
      author: req.user._id as string,
      supportRequest: id,
      text: data.text,
    };
    const result = await this.chatService.sendMessage(messageData);
    const answer = {
      id: String(result._id),
      createdAt: result.createdAt.toISOString(),
      text: result.text,
      readAt: result.readAt ? result.readAt.toISOString() : '',
      author: {
        id: String(result.author._id),
        name: req.user.name as string,
      },
    };

    this.chatEmitter.emit('newMessage', {
      supportRequest: id,
      message: answer,
    });
    return [{ ...answer }];
  }

  /**
   * отметка сообщений прочитанным менеджером и клиентом
   * @param req
   * @param id
   * @param data
   * @returns
   */
  @Roles(Role.Manager, Role.Client)
  @Post(':id/messages/read')
  async readMessages(
    @Request() req,
    @Param('id') id: string,
    @Body() data: ReadDto,
  ): Promise<{ success: boolean }> {
    await this.chatService.validate(id, req.user._id, req.user.role);
    const markMessageParams = {
      user: req.user._id as string,
      supportRequest: id,
      createdBefore: new Date(data.createdBefore),
    };
    if (req.user.role == 'client') {
      await this.clientServise.markMessagesAsRead(markMessageParams);
      return { success: true };
    }
    await this.managerService.markMessagesAsRead(markMessageParams);
    return { success: true };
  }
}
