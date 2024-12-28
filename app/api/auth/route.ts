import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import * as tokenService from "@/server/services/tokenService";
import * as userService from "@/server/services/userService";
import { apiCatchErrorHandler } from "@/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import * as cookieService from "./../../../server/services/cookieService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.json({ auth: false });
    }

    const [tokenPayload, tokenData] = await Promise.all([
      tokenService.validateRefreshToken(refreshToken),
      tokenService.findRefreshToken(refreshToken),
    ]);

    if (!tokenPayload || !tokenData) {
      await cookieService.removeTokensFromCookies();
      !!tokenData && tokenService.removeRefreshToken(refreshToken);

      return NextResponse.json({ auth: false });
    }

    userService.updateUserLastVisit(tokenPayload.id);

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
