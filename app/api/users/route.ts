import prisma from "@/lib/prisma";
import { UserCreationBody } from "@/models/users";
import * as userService from "@/server/services/userService";
import { cookies } from "next/headers";

const REFRESH_TOKEN_COOKIE = "refreshToken";

export async function GET() {
  const users = await prisma.users.findMany();

  return Response.json(users);
}

export async function POST(request: Request) {
  try {
    const userData: UserCreationBody = await request.json();
    const { email, name } = userData;

    const userDto = await userService.registration(userData);

    const cookieStore = cookies();
    cookieStore.set(REFRESH_TOKEN_COOKIE, userDto.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return new Response(JSON.stringify(userDto), {
      status: 200,
      // headers: { [REFRESH_TOKEN_COOKIE]: `token=${userDto.refreshToken}` },
    });
  } catch (error) {
    Promise.reject(error);
  }
}
