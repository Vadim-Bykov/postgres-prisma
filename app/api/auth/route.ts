import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "./../../../server/services/cookieService";
import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import { setTokensToCookies } from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { getUser } from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) return NextResponse.json({ auth: false });

    // request.headers.set("Cache-Control", "no-cache");

    const tokenPayload = await tokenService.validateRefreshToken(refreshToken);

    if (tokenPayload instanceof NextResponse) {
      cookieService.removeTokensFromCookies();

      return NextResponse.json({ auth: false });
      // return tokenPayload;
    } else {
      const userData = await getUser(tokenPayload.id);
      if (!userData) {
        cookieService.removeTokensFromCookies();
        return NextResponse.json({ auth: false });
      }

      const { refreshToken: updatedRefreshToken } =
        await tokenService.generateToken(tokenPayload);

      const tokeData = await tokenService.saveRefreshToken({
        userId: tokenPayload.id,
        refreshToken,
        updatedRefreshToken,
      });

      setTokensToCookies({ refreshToken: tokeData.refreshToken });

      return NextResponse.json({
        user: tokenPayload,
        auth: true,
      });
    }
  } catch (error) {
    throw ApiError.internal();
  }
}
