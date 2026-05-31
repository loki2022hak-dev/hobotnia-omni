import { PrismaService } from '../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ChatGateway } from './chat.gateway';
declare class ChatDto {
    title?: string;
    isGroup: boolean;
    memberIds: string[];
}
declare class MessageDto {
    content: string;
    attachments?: string[];
}
export declare class ChatController {
    private prisma;
    private notifications;
    private gateway;
    constructor(prisma: PrismaService, notifications: NotificationsService, gateway: ChatGateway);
    list(user: any): import("../generated/prisma").Prisma.PrismaPromise<({
        messages: {
            id: string;
            createdAt: Date;
            authorId: string;
            content: string;
            chatId: string;
            attachments: string[];
            reactions: import("src/generated/prisma/runtime/library").JsonValue;
        }[];
        members: ({
            user: {
                id: string;
                username: string;
            };
        } & {
            userId: string;
            chatId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string | null;
        isGroup: boolean;
    })[]>;
    create(user: any, dto: ChatDto): import("../generated/prisma").Prisma.Prisma__ChatClient<{
        id: string;
        createdAt: Date;
        title: string | null;
        isGroup: boolean;
    }, never, import("src/generated/prisma/runtime/library").DefaultArgs>;
    assertMember(chatId: string, userId: string): Promise<void>;
    messages(user: any, id: string): Promise<({
        author: {
            id: string;
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        content: string;
        chatId: string;
        attachments: string[];
        reactions: import("src/generated/prisma/runtime/library").JsonValue;
    })[]>;
    getMessages(user: any, id: string): Promise<({
        author: {
            id: string;
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        content: string;
        chatId: string;
        attachments: string[];
        reactions: import("src/generated/prisma/runtime/library").JsonValue;
    })[]>;
    message(user: any, id: string, dto: MessageDto): Promise<{
        chat: {
            members: {
                userId: string;
                chatId: string;
                joinedAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            title: string | null;
            isGroup: boolean;
        };
        author: {
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        authorId: string;
        content: string;
        chatId: string;
        attachments: string[];
        reactions: import("src/generated/prisma/runtime/library").JsonValue;
    }>;
}
export {};
