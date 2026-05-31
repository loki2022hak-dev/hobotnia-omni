import { Server } from 'socket.io';
export declare class NotificationsGateway {
    server: Server;
    emitToUser(userId: string, payload: unknown): void;
}
