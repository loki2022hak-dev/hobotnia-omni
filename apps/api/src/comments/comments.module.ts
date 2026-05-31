import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommentsController } from './comments.controller';
@Module({ imports: [NotificationsModule], controllers: [CommentsController] })
export class CommentsModule {}
