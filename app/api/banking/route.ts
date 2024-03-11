import { ApiError } from "@/server/error/ApiError";
import * as bankingService from "@/server/services/bankingService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banking = await bankingService.getBankingData();

    return NextResponse.json(banking);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при получении банковских данных",
        error
      );
    }
  }
}
