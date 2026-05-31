import { createHash, createHmac } from 'node:crypto';
import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';

type CryptoPayResponse<T> = { ok: boolean; result?: T; error?: string };
type CryptoInvoice = {
  invoice_id: number;
  status: string;
  bot_invoice_url?: string;
  mini_app_invoice_url?: string;
  web_app_invoice_url?: string;
  payload?: string;
};

@Injectable()
export class CryptoPayService {
  private baseUrl() {
    return process.env.CRYPTO_PAY_API_URL ?? 'https://pay.crypt.bot/api';
  }

  private token() {
    const token = process.env.CRYPTO_PAY_API_TOKEN;
    if (!token) throw new BadGatewayException('Crypto Bot payment token is not configured');
    return token;
  }

  verifySignature(body: unknown, signature?: string | string[]) {
    if (!signature) return false;
    const token = this.token();
    const secret = createHash('sha256').update(token).digest();
    const checkString = JSON.stringify(body);
    const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
    return hmac === (Array.isArray(signature) ? signature[0] : signature);
  }

  assertWebhookSecret(secret: string) {
    const expected = process.env.CRYPTO_PAY_WEBHOOK_SECRET;
    if (!expected || secret !== expected) throw new UnauthorizedException('Invalid payment webhook secret');
  }

  async createInvoice(params: { amountUsd: number; description: string; payload: string; paidBtnUrl: string }) {
    return this.request<CryptoInvoice>('createInvoice', {
      currency_type: 'fiat',
      fiat: 'USD',
      amount: String(params.amountUsd),
      accepted_assets: 'USDT,TON,BTC,ETH,LTC,BNB,TRX,USDC',
      description: params.description,
      payload: params.payload,
      paid_btn_name: 'callback',
      paid_btn_url: params.paidBtnUrl,
      allow_comments: false,
      allow_anonymous: false,
      expires_in: 3600
    });
  }

  async getInvoice(invoiceId: string) {
    const result = await this.request<{ items?: CryptoInvoice[] } | CryptoInvoice[]>('getInvoices', { invoice_ids: invoiceId });
    if (Array.isArray(result)) return result[0];
    return result.items?.[0];
  }

  private async request<T>(method: string, body?: Record<string, unknown>) {
    const response = await fetch(`${this.baseUrl()}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Crypto-Pay-API-Token': this.token()
      },
      body: JSON.stringify(body ?? {})
    });
    const data = (await response.json()) as CryptoPayResponse<T>;
    if (!response.ok || !data.ok || !data.result) throw new BadGatewayException(data.error ?? `Crypto Pay ${method} failed`);
    return data.result;
  }
}
