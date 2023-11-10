import { UserCreationBody } from "@/models/users";
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
    Promise.reject(error);
  }
}

export async function POST(request: Request) {
  try {
    const userData: UserCreationBody = await request.json();

    const userDto = await userService.registration(userData);
    const { refreshToken } = userDto;

    cookieService.setTokensToCookies({ refreshToken });

    return NextResponse.json(userDto);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Registration error", error);
    }
  }
}
