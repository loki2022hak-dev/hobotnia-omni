import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: process.env.WEB_ORIGIN ?? '*', credentials: true } })
export class NotificationsGateway {
  @WebSocketServer() server!: Server;

  emitToUser(userId: string, payload: unknown) {
    this.server.emit(`notification:${userId}`, payload);
  }
}
