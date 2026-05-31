"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const cookie_parser_1 = require("cookie-parser");
const helmet_1 = require("helmet");
const csurf_1 = require("csurf");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: process.env.WEB_ORIGIN?.split(',') ?? true, credentials: true });
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, csurf_1.default)({ cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }, ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }));
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.listen(Number(process.env.PORT ?? 4000), '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map