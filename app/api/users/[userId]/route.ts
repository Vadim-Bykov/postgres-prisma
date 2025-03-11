import prisma from "@/lib/prisma";
import { ApiError } from "@/server/error/ApiError";
import { removeTokensFromCookies } from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ userId: string }>;

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params;
    const userId = params.userId;

    const user = await userService.getUser(+userId);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при получении данных пользователя",
        error
      );
    }
  }
}

export async function DELETE(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    const params = await segmentData.params;
    const userId = params.userId;

    const userDto = await userService.deleteUser(+userId);

    await removeTokensFromCookies();

    return NextResponse.json(userDto);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при удалении пользователя", error);
    }
  }
}
