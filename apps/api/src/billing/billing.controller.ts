import { Body, Controller, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BillingService } from './billing.service';
import { CryptoPayService } from './crypto-pay.service';

class CheckoutDto {
  @IsString() plan!: string;
}

@Controller('billing')
export class BillingController {
  constructor(private billing: BillingService, private cryptoPay: CryptoPayService) {}

  @Public()
  @Get('plans')
  plans() {
    return this.billing.plans();
  }

  @Get('me')
  me(@CurrentUser() user: any) {
    return this.billing.myBilling(user.sub);
  }

  @Post('checkout')
  checkout(@CurrentUser() user: any, @Body() dto: CheckoutDto) {
    return this.billing.createCheckout(user.sub, dto.plan);
  }

  @Post('payments/:id/sync')
  sync(@CurrentUser() user: any, @Param('id') id: string) {
    return this.billing.syncInvoice(user.sub, id);
  }

  @Public()
  @Post('crypto/webhook/:secret')
  webhook(@Param('secret') secret: string, @Body() body: unknown, @Headers('crypto-pay-api-signature') signature?: string) {
    this.cryptoPay.assertWebhookSecret(secret);
    if (signature && !this.cryptoPay.verifySignature(body, signature)) throw new UnauthorizedException('Invalid payment webhook signature');
    return this.billing.handleWebhook(body);
  }
}
