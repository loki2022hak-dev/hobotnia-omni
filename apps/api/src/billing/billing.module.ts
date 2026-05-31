import { Module } from '@nestjs/common';
import { PrismaModule } from '../common/prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { CryptoPayService } from './crypto-pay.service';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [BillingController],
  providers: [BillingService, CryptoPayService]
})
export class BillingModule {}
