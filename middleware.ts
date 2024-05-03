import type { NextRequest } from "next/server";
import { ApiError } from "./server/error/ApiError";
import { authMiddleware } from "./server/middlewares/auth";

export async function middleware(request: NextRequest) {
  try {
    if (
      // TODO: uncomment if we want BY users to be restricted
      // (request.nextUrl.pathname.includes("/banking") ||
      request.nextUrl.pathname.includes("/users/") &&
      request.method === "GET"
    ) {
      const response = await authMiddleware(request);

      return response;
    }
  } catch (error: any) {
    return ApiError.internal(undefined, error);
  }
}
