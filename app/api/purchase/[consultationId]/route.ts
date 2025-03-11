import { ApiError } from "@/server/error/ApiError";
import * as purchaseService from "@/server/services/purchaseService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ consultationId: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const consultationId = params.consultationId;
    const user = await purchaseService.getUserPurchase(+consultationId);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при получении покупки пользователя",
        error
      );
    }
  }
}
