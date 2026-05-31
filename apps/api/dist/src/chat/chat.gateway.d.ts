import { Server, Socket } from 'socket.io';
export declare class ChatGateway {
    server: Server;
    online(body: {
        userId: string;
    }): void;
    join(socket: Socket, body: {
        chatId: string;
    }): void;
    typing(body: {
        chatId: string;
        userId: string;
        typing: boolean;
    }): void;
    message(body: unknown): void;
    notification(body: {
        userId: string;
        payload: unknown;
    }): void;
}
