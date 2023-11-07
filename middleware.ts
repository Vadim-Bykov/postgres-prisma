import { NextResponse } from "next/server";
import type { NextRequest, NextMiddleware, NextFetchEvent } from "next/server";
import { authMiddleware } from "./server/middlewares/auth";
import { ApiError } from "./server/error/ApiError";

export async function middleware(request: NextRequest) {
  try {
    if (
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
