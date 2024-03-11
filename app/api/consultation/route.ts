import { ApiError } from "@/server/error/ApiError";
import * as consultationService from "@/server/services/consultationService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const consultations = await consultationService.getAllConsultations();

    return NextResponse.json(consultations);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при получении консультаций", error);
    }
  }
}
