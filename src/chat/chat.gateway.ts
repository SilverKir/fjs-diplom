import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SupportRequestService } from './services';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageAnswer } from './interfaces';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway {
  constructor(private readonly supportRequestService: SupportRequestService) {}
  @WebSocketServer()
  server: Server;

  @OnEvent('newMessage')
  handleChatMessageEvent(payload: {
    supportRequest: string;
    message: MessageAnswer;
  }) {
    this.server.emit(payload.supportRequest, payload.message);
  }
}
