import * as cookieService from "./../services/cookieService";
import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../error/ApiError";
import { validateRefreshToken } from "../services/tokenService";

export class AuthError extends Error {}

export const authMiddleware = async (req: NextRequest) => {
  try {
    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return ApiError.unauthorized();
    }
    const userData = await validateRefreshToken(refreshToken);

    if (userData instanceof NextResponse) {
      // it means token is expired
      await cookieService.removeTokensFromCookies();

      return userData;
    }
  } catch (error: unknown) {
    // validateRefreshToken throws the 401 response for an invalid or expired token;
    // pass it through instead of reporting it as a 500.
    if (error instanceof NextResponse) {
      return error;
    }

    return ApiError.internal(
      "Произошла внутренняя ошибка системы на уровне авторизации",
      error
    );
  }
};
