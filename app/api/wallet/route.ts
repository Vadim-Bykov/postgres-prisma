import { ApiError } from "@/server/error/ApiError";
import * as walletService from "@/server/services/walletService";
import * as cookieService from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const refreshToken = cookieService.getTokensFromCookies();

    if (!refreshToken) {
      throw ApiError.unauthorized();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const wallet = await walletService.getWallet({ userId: userData.id });

    return NextResponse.json(wallet);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при получении данных кошелька", error);
    }
  }
}
