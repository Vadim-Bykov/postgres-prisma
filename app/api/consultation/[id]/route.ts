import { ApiError } from "@/server/error/ApiError";
import * as consultationService from "@/server/services/consultationService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const consultation = await consultationService.getConsultation(+id);

    return NextResponse.json(consultation);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при получении консультации", error);
    }
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const consultation = await consultationService.deprecateConsultation(+id);

    return NextResponse.json(consultation);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при удалении консультации", error);
    }
  }
}
