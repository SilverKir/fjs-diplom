import { Controller, Get, Query } from '@nestjs/common';

import {
  SupportRequestEmployeeService,
  SupportRequestService,
} from '../services';
import { Roles } from 'src/auth';
import { Role } from 'src/users';
import { RequestAnswer } from '../interfaces';

@Controller('api')
export class ChatEmpoloyeeController {
  constructor(
    private managerService: SupportRequestEmployeeService,
    private chatService: SupportRequestService,
  ) {}

  @Roles(Role.Manager)
  @Get('manager/support-requests')
  async getRequests(
    @Query('isActive') isActive: boolean,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<RequestAnswer[]> {
    const allUserRequests = await this.chatService.findSupportRequests({
      user: null,
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
        const unreadCount = await this.managerService.getUnreadCount(el._id);
        return {
          id: String(el._id),
          createdAt: el.createdAt.toISOString(),
          isActive: el.isActive,
          hasNewMessages: unreadCount.length > 0,
          client: {
            id: String(el.user._id),
            name: el.user.name,
            email: el.user.email,
            contactPhone: el.user.contactPhone,
          },
        };
      });

    return Promise.all(promises);
  }
}
