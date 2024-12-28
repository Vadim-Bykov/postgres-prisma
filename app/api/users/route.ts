import { UpdateUserPersonalDataBody, UserCreationBody } from "@/models/users";
import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await userService.getAllUsers();

    return NextResponse.json(users);
  } catch (error) {
    return ApiError.badRequest(
      "Ошибка при получении данных пользователей",
      error
    );
  }
}

export async function POST(request: Request) {
  try {
    const userData: UserCreationBody = await request.json();

    const userDto = await userService.registration(userData);
    const { refreshToken } = userDto;

    await cookieService.setTokensToCookies({ refreshToken });

    return NextResponse.json(userDto);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Ошибка при регистрации пользователя", error);
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const userData: UpdateUserPersonalDataBody = await request.json();

    const updatedUserData = await userService.updateUserPersonalData(userData);
    const { refreshToken, user } = updatedUserData;

    await cookieService.setTokensToCookies({ refreshToken });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest(
        "Ошибка при обновлении данных пользователя",
        error
      );
    }
  }
}
