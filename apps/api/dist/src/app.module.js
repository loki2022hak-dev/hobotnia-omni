"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const posts_module_1 = require("./posts/posts.module");
const comments_module_1 = require("./comments/comments.module");
const communities_module_1 = require("./communities/communities.module");
const forum_module_1 = require("./forum/forum.module");
const chat_module_1 = require("./chat/chat.module");
const admin_module_1 = require("./admin/admin.module");
const reports_module_1 = require("./reports/reports.module");
const jobs_module_1 = require("./jobs/jobs.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
const notifications_module_1 = require("./notifications/notifications.module");
const search_module_1 = require("./search/search.module");
const billing_module_1 = require("./billing/billing.module");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
            communities_module_1.CommunitiesModule,
            forum_module_1.ForumModule,
            chat_module_1.ChatModule,
            admin_module_1.AdminModule,
            reports_module_1.ReportsModule,
            jobs_module_1.JobsModule,
            marketplace_module_1.MarketplaceModule,
            notifications_module_1.NotificationsModule,
            search_module_1.SearchModule,
            billing_module_1.BillingModule
        ],
        controllers: [health_controller_1.HealthController],
        providers: [{ provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map