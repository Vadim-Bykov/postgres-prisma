import { ApiError } from "@/server/error/ApiError";
import * as bonusService from "@/server/services/bonusService";
import * as cookieService from "@/server/services/cookieService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const friendObjectId = searchParams.get("friendObjectId");

    const userData = await cookieService.getUserDataFromCookies();
    let bonuses;
    if (!friendObjectId) {
      bonuses = await bonusService.getUserBonuses(userData.id);
    } else {
      bonuses = await bonusService.getBonusesFromFriend(+friendObjectId);
    }

    return NextResponse.json(bonuses);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при получении данных кошелька", error);
    }
  }
}
