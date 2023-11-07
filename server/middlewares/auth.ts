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
      cookieService.removeTokensFromCookies();

      return userData;
    }
  } catch (error: any) {
    return ApiError.internal("Some internal error occurred in auth", error);
  }
};
