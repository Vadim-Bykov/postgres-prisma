import { ApiError } from "@/server/error/ApiError";
import * as userService from "@/server/services/userService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { link: string } }
) {
  try {
    const { link } = params;

    const passwordData = await userService.resetUserPassword(link);

    return NextResponse.json(passwordData);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest(
        "Ошибка при сбросе пароля пользователя",
        error
      );
    }
  }
}
