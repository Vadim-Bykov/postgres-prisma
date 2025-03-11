import { ApiError } from "@/server/error/ApiError";
import * as friendService from "@/server/services/friendService";
import * as cookieService from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const refreshToken = await cookieService.getTokensFromCookies();

    if (!refreshToken) {
      throw ApiError.unauthorized();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const friends = await friendService.getAllFriends({
      email: userData.email,
    });

    return NextResponse.json(friends);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при получении данных кошелька", error);
    }
  }
}
