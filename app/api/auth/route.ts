import * as cookieService from "./../../../server/services/cookieService";
import { UserDto } from "./../../../server/dtos/userDto";
import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import { setTokensToCookies } from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) return NextResponse.json({ auth: false });

    const tokenPayload = await tokenService.validateRefreshToken(refreshToken);

    if (tokenPayload instanceof NextResponse) {
      cookieService.removeTokensFromCookies();

      return NextResponse.json({ auth: false });
      // return tokenPayload;
    } else {
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
    Promise.reject(error);
  }
}
