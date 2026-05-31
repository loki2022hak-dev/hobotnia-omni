"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const billing_service_1 = require("./billing.service");
const crypto_pay_service_1 = require("./crypto-pay.service");
class CheckoutDto {
    plan;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "plan", void 0);
let BillingController = class BillingController {
    billing;
    cryptoPay;
    constructor(billing, cryptoPay) {
        this.billing = billing;
        this.cryptoPay = cryptoPay;
    }
    plans() {
        return this.billing.plans();
    }
    me(user) {
        return this.billing.myBilling(user.sub);
    }
    checkout(user, dto) {
        return this.billing.createCheckout(user.sub, dto.plan);
    }
    sync(user, id) {
        return this.billing.syncInvoice(user.sub, id);
    }
    webhook(secret, body, signature) {
        this.cryptoPay.assertWebhookSecret(secret);
        if (signature && !this.cryptoPay.verifySignature(body, signature))
            throw new common_1.UnauthorizedException('Invalid payment webhook signature');
        return this.billing.handleWebhook(body);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "plans", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CheckoutDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "checkout", null);
__decorate([
    (0, common_1.Post)('payments/:id/sync'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "sync", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('crypto/webhook/:secret'),
    __param(0, (0, common_1.Param)('secret')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('crypto-pay-api-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "webhook", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService, crypto_pay_service_1.CryptoPayService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map