import { Body, Controller, Post, Request, Get, Query } from '@nestjs/common';

import {
  SupportRequestClientService,
  SupportRequestService,
} from '../services';
import { Roles } from 'src/auth';
import { Role } from 'src/users';
import { ChatDto } from '../dto';
import { RequestAnswer } from '../interfaces';

@Controller('api')
export class ChatClientController {
  constructor(
    private clientService: SupportRequestClientService,
    private chatService: SupportRequestService,
  ) {}

  @Roles(Role.Client)
  @Post('client/support-requests')
  async createRequest(
    @Request() req,
    @Body() data: ChatDto,
  ): Promise<Partial<RequestAnswer>[]> {
    const chatReq = await this.clientService.createSupportRequest({
      user: req.user._id as string,
      text: data.text,
    });

    return [
      {
        id: String(chatReq._id),
        createdAt: chatReq.createdAt.toISOString(),
        isActive: chatReq.isActive,
        hasNewMessages: true,
      },
    ];
  }

  @Roles(Role.Client)
  @Get('client/support-requests')
  async getRequests(
    @Request() req,
    @Query('isActive') isActive: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<Partial<RequestAnswer>[]> {
    const allUserRequests = await this.chatService.findSupportRequests({
      user: req.user._id as string,
      isActive: isActive,
    });
    if (allUserRequests.length == 0) {
      return [];
    }
    const reqLimit = limit ? limit : allUserRequests.length;
    const reqOffset = offset ? offset : 0;
    const promises = allUserRequests
      .slice(reqOffset, Number(reqLimit) + Number(reqOffset))
      .map(async (el) => {
        const unreadCount = await this.clientService.getUnreadCount(el._id);
        return {
          id: String(el._id),
          createdAt: el.createdAt.toISOString(),
          isActive: el.isActive,
          hasNewMessages: unreadCount.length > 0,
        };
      });

    return Promise.all(promises);
  }
}
