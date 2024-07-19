import { ApiError } from "@/server/error/ApiError";
import * as bonusService from "@/server/services/bonusService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const friendObjectId = searchParams.get("friendObjectId");

    if (!friendObjectId) {
      throw ApiError.badRequest("Не передан ID объекта");
    }

    const bonuses = await bonusService.getBonusesFromFriend(+friendObjectId);

    return NextResponse.json(bonuses);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при получении данных кошелька", error);
    }
  }
}
