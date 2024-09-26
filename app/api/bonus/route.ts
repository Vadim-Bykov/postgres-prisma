import { ViewedBonusBody } from "@/models/bonus";
import { ApiError } from "@/server/error/ApiError";
import * as bonusService from "@/server/services/bonusService";
import * as cookieService from "@/server/services/cookieService";
import { apiCatchErrorHandler } from "@/utils/errorHandler";
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
    return apiCatchErrorHandler({
      error,
      message: "Ошибка при получении данных бонусов",
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const body: ViewedBonusBody = await request.json();
    const userData = await cookieService.getUserDataFromCookies();
    const bonus = await bonusService.markViewedBonus(
      +body.bonusId,
      userData.id
    );

    return NextResponse.json(bonus);
  } catch (error) {
    return apiCatchErrorHandler({
      error,
      message: "Ошибка при получении данных бонуса для отметки просмотра",
    });
  }
}
