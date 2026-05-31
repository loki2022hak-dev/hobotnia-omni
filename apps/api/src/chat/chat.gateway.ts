import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: process.env.WEB_ORIGIN ?? '*', credentials: true } })
export class ChatGateway {
  @WebSocketServer() server!: Server;
  @SubscribeMessage('presence:online') online(@MessageBody() body: { userId: string }) { this.server.emit('presence:update', { userId: body.userId, status: 'online' }); }
  @SubscribeMessage('chat:join') join(@ConnectedSocket() socket: Socket, @MessageBody() body: { chatId: string }) { socket.join(body.chatId); }
  @SubscribeMessage('chat:typing') typing(@MessageBody() body: { chatId: string; userId: string; typing: boolean }) { this.server.to(body.chatId).emit('chat:typing', body); }
  @SubscribeMessage('chat:message') message(@MessageBody() body: unknown) { this.server.emit('chat:message', body); }
  @SubscribeMessage('notification') notification(@MessageBody() body: { userId: string; payload: unknown }) { this.server.emit(`notification:${body.userId}`, body.payload); }
}
