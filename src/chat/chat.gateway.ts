import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportRequestService, ChatService } from './services';
import { IUser, IUserAnswer } from 'src/users/interfaces';
import { Message, SupportRequest } from './models';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly supportRequestService: SupportRequestService,
  ) {}
  afterInit() {
    console.log(`WebSocket server initialized`);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    if (!this.chatService.getClientId(client.id)) {
      this.chatService.addClient(client);
    }
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    if (this.chatService.getClientId(client.id)) {
      this.chatService.removeClient(client.id);
      client.disconnect(true);
    }
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { author: string; supportRequest: string; text: string },
  ) {
    const chat = await this.supportRequestService.sendMessage(payload);
    this.server.to(payload.supportRequest).emit('receiveMessage', chat);
  }

  @SubscribeMessage('subscribeToChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatId') chatId: string,
  ) {
    const { user } = client.request as unknown as Request & {
      user: IUserAnswer;
    };
    await this.supportRequestService.validate(chatId, user.id, user.role);
    this.supportRequestService.subscribe(
      (supportRequest: SupportRequest, message: Message) => {
        if (String(supportRequest) === chatId) {
          // client.join(chatId);
          client.emit(chatId, message);
        }
      },
    );
  }
}
