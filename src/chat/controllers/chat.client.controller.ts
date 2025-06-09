import { Body, Controller, Post, Request } from '@nestjs/common';

import { SupportRequestClientService } from '../services';
import { Roles } from 'src/auth';
import { Role } from 'src/users';
import { ChatDto } from '../dto';
import { RequestAnswer } from '../interfaces';

@Controller('api')
export class ChatClientController {
  constructor(private clientService: SupportRequestClientService) {}

  @Roles(Role.Client)
  @Post('client/support-requests')
  async createRequest(
    @Request() req,
    @Body() data: ChatDto,
  ): Promise<RequestAnswer[]> {
    const chatReq = await this.clientService.createSupportRequest({
      user: req.user._d as string,
      text: data.text,
    });

    return [
      {
        id: String(chatReq._id),
        createdAt: chatReq.createdAt,
        isActive: chatReq.isActive,
        hasNewMessages: false,
      },
    ];
  }
}
