import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  private clients: Socket[] = [];
  addClient(client: Socket): void {
    this.clients.push(client);
    console.log(this.clients.length);
  }
  removeClient(id: string) {
    this.clients = this.clients.filter((client) => client.id !== id);
    console.log(this.clients.length);
  }
  getClientId(id: string): Socket | undefined {
    if (!this.clients) return undefined;
    return this.clients.find((client) => client.id === id);
  }
}
