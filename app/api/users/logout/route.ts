import { UserLoginBody } from "@/models/users";
import { ApiError } from "@/server/error/ApiError";
import * as cookieService from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const refreshToken = cookieService.getTokensFromCookies();

    if (!refreshToken) {
      return ApiError.badRequest("User has already unauthorized");
    }

    cookieService.removeTokensFromCookies();

    const tokenData = await userService.logout(refreshToken);
    // const { refreshToken } = userDto;

    return NextResponse.json(tokenData);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Logout error", error);
    }
  }
}
