import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/users';

import {
  ChatClientController,
  ChatCommonController,
  ChatEmpoloyeeController,
} from './controllers';
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
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    ChatClientController,
    ChatEmpoloyeeController,
    ChatCommonController,
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class ChatModule {}
