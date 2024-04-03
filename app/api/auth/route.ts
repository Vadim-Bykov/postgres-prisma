import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "./../../../server/services/cookieService";
import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import { setTokensToCookies } from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import * as userService from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";
import { getUserDto } from "@/server/dtos/userDto";
import { apiCatchErrorHandler, catchErrorHandler } from "@/utils/errorHandler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) return NextResponse.json({ auth: false });

    const tokenPayload = await tokenService.validateRefreshToken(refreshToken);

    if (!tokenPayload) {
      cookieService.removeTokensFromCookies();

      return NextResponse.json({ auth: false });
    }

    const tokenData = await tokenService.findRefreshToken(refreshToken);

    if (!tokenData) {
      cookieService.removeTokensFromCookies();
      tokenService.removeRefreshToken(refreshToken);

      return NextResponse.json({ auth: false });
    }

    const { refreshToken: updatedRefreshToken } =
      await tokenService.generateToken(tokenPayload);

    setTokensToCookies({ refreshToken: updatedRefreshToken });

    // we don't wait for the responses below since it takes significant time and causes issues with multiple page reload (a new token can be missed)
    Promise.all([
      tokenService.saveRefreshToken({
        userId: tokenPayload.id,
        refreshToken,
        updatedRefreshToken,
      }),
      userService.updateUserLastVisit(tokenPayload.id),
    ]);

    return NextResponse.json({
      user: tokenPayload,
      auth: true,
    });
  } catch (error) {
    return apiCatchErrorHandler({
      error,
      message: "Ошибка при при идентификации юзера",
    });
  }
}
