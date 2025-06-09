import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatController } from './chat.controller';
import {
  SupportRequestService,
  SupportRequestClientService,
  SupportRequestEmployeeService,
} from './services';
import {
  Message,
  MessageSchema,
  SupportRequest,
  SupportRequestSchema,
} from './models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class ChatModule {}
