import prisma from "@/lib/prisma";
import { ApiError } from "@/server/error/ApiError";
import { removeTokensFromCookies } from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

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
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const userDto = await userService.deleteUser(+userId);

    // TODO: uncomment after implementing close account feature
    removeTokensFromCookies();

    return NextResponse.json(userDto);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Ошибка при удалении пользователя", error);
    }
  }
}
