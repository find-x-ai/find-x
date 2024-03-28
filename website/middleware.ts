import { CorsMiddleware } from "nextjs-edge-cors";

export const middleware = CorsMiddleware({
  origin: "*",
});

export const config = {
  matcher: ["/api/cors/:path*"],
};
