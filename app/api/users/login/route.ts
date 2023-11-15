import { UserLoginBody } from "@/models/users";
import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userData: UserLoginBody = await request.json();

    const userDto = await userService.login(userData);

    const { refreshToken } = userDto;

    cookieService.setTokensToCookies({ refreshToken });

    return NextResponse.json(userDto);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Login error", error);
    }
  }
}
