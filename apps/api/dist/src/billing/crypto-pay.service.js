"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoPayService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
let CryptoPayService = class CryptoPayService {
    baseUrl() {
        return process.env.CRYPTO_PAY_API_URL ?? 'https://pay.crypt.bot/api';
    }
    token() {
        const token = process.env.CRYPTO_PAY_API_TOKEN;
        if (!token)
            throw new common_1.BadGatewayException('Crypto Bot payment token is not configured');
        return token;
    }
    verifySignature(body, signature) {
        if (!signature)
            return false;
        const token = this.token();
        const secret = (0, node_crypto_1.createHash)('sha256').update(token).digest();
        const checkString = JSON.stringify(body);
        const hmac = (0, node_crypto_1.createHmac)('sha256', secret).update(checkString).digest('hex');
        return hmac === (Array.isArray(signature) ? signature[0] : signature);
    }
    assertWebhookSecret(secret) {
        const expected = process.env.CRYPTO_PAY_WEBHOOK_SECRET;
        if (!expected || secret !== expected)
            throw new common_1.UnauthorizedException('Invalid payment webhook secret');
    }
    async createInvoice(params) {
        return this.request('createInvoice', {
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
    async getInvoice(invoiceId) {
        const result = await this.request('getInvoices', { invoice_ids: invoiceId });
        if (Array.isArray(result))
            return result[0];
        return result.items?.[0];
    }
    async request(method, body) {
        const response = await fetch(`${this.baseUrl()}/${method}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Crypto-Pay-API-Token': this.token()
            },
            body: JSON.stringify(body ?? {})
        });
        const data = (await response.json());
        if (!response.ok || !data.ok || !data.result)
            throw new common_1.BadGatewayException(data.error ?? `Crypto Pay ${method} failed`);
        return data.result;
    }
};
exports.CryptoPayService = CryptoPayService;
exports.CryptoPayService = CryptoPayService = __decorate([
    (0, common_1.Injectable)()
], CryptoPayService);
//# sourceMappingURL=crypto-pay.service.js.map