import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const refreshToken = await cookieService.getTokensFromCookies();

    if (!refreshToken) {
      return ApiError.unauthorized();
    }

    await cookieService.removeTokensFromCookies();

    const tokenData = await userService.logout(refreshToken);

    return NextResponse.json(tokenData);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest(
        "Ошибка при выходе из аккаунта пользователя",
        error
      );
    }
  }
}
