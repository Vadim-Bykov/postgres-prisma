import prisma from "@/lib/prisma";
import { UserCreationBody } from "@/models/users";
import { setTokensToCookies } from "@/server/services/cookieService";
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

    setTokensToCookies({ refreshToken });

    return NextResponse.json(userDto);
  } catch (error) {
    Promise.reject(error);
  }
}
