import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Фіксуємо час старту обробки запиту на Edge-ноді
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(2, 9).toUpperCase();

  // Логуємо вхідний трафік у консоль Vercel / локальний термінал
  console.log(`[REQ] ID: ${requestId} | [${request.method}] -> ${request.nextUrl.pathname}`);

  const response = NextResponse.next();

  // Додаємо безпекові заголовки (CORS, Clickjacking protection, XSS Protection)
  response.headers.set("X-Request-ID", requestId);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Обчислюємо фінальний час обробки перед віддачею клієнту
  const duration = Date.now() - startTime;
  response.headers.set("X-Response-Time-MS", `${duration}`);

  console.log(`[RES] ID: ${requestId} | Status: ${response.status} | Duration: ${duration}ms`);

  return response;
}

// Конфігуруємо Middleware так, щоб він тригерився виключно на API маршрути
export const config = {
  matcher: "/api/:path*",
};
