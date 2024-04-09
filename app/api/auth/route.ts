import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import { setTokensToCookies } from "@/server/services/cookieService";
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

    const tokenPayload = await tokenService.validateRefreshToken(refreshToken);
    const tokenData = await tokenService.findRefreshToken(refreshToken);

    if (!tokenPayload || !tokenData) {
      cookieService.removeTokensFromCookies();
      !!tokenData && tokenService.removeRefreshToken(refreshToken);

      return NextResponse.json({ auth: false });
    }

    const { refreshToken: updatedRefreshToken } =
      await tokenService.generateToken(tokenPayload);

    const tokeData = await tokenService.saveRefreshToken({
      userId: tokenPayload.id,
      refreshToken,
      updatedRefreshToken,
    });

    userService.updateUserLastVisit(tokenPayload.id);
    setTokensToCookies({ refreshToken: tokeData.refreshToken });

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
