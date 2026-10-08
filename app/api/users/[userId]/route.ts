import { getUserDto } from "@/server/dtos/userDto";
import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { apiCatchErrorHandler } from "@/utils/errorHandler";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Params = Promise<{ userId: string }>;

const parseUserId = async (segmentData: { params: Params }) => {
  const { userId } = await segmentData.params;
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest("Некорректный идентификатор пользователя.");
  }

  return id;
};

// A user may read or delete only their own account; an admin may manage any account.
const assertCanManageUser = async (targetUserId: number) => {
  const userData = await cookieService.getUserDataFromCookies();
  const isSelf = userData.id === targetUserId;
  const isAdmin = userData.role === "ADMIN";

  if (!isSelf && !isAdmin) {
    throw ApiError.forbidden(
      "Доступ только к своему аккаунту или для администратора."
    );
  }

  return { isSelf };
};

export async function GET(request: Request, segmentData: { params: Params }) {
  try {
    const userId = await parseUserId(segmentData);
    await assertCanManageUser(userId);

    const user = await userService.getUser(userId);

    if (!user) {
      throw ApiError.badRequest("Пользователь не найден.");
    }

    return NextResponse.json(getUserDto(user));
  } catch (error) {
    return apiCatchErrorHandler({
      error,
      message: "Ошибка при получении данных пользователя",
    });
  }
}

export async function DELETE(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    const userId = await parseUserId(segmentData);
    const { isSelf } = await assertCanManageUser(userId);

    const userDto = await userService.deleteUser(userId);

    if (isSelf) {
      await cookieService.removeTokensFromCookies();
    }

    return NextResponse.json(userDto);
  } catch (error) {
    return apiCatchErrorHandler({
      error,
      message: "Ошибка при удалении пользователя",
    });
  }
}
