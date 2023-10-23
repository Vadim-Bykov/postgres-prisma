import prisma from "@/lib/prisma";
import { UserCreationBody } from "@/models/users";
import * as userService from "@/server/services/userService";

const REFRESH_TOKEN_COOKIE = "refreshToken";
const ACCESS_TOKEN_COOKIE = "accessToken";

export async function GET() {
  const users = await prisma.users.findMany();

  return Response.json(users);
}

export async function POST(request: Request) {
  try {
    const userData: UserCreationBody = await request.json();
    // const { email, name } = userData;

    const userDto = await userService.registration(userData);

    // const cookieStore = cookies();
    // cookieStore.delete(REFRESH_TOKEN_COOKIE);
    // cookieStore.set(REFRESH_TOKEN_COOKIE, userDto.refreshToken, {
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    // });
    // cookieStore.set(ACCESS_TOKEN_COOKIE, userDto.accessToken, {
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    // });

    // return Response.json(userDto);

    return new Response(JSON.stringify(userDto), {
      status: 200,
      headers: { Authorization: `Token ${userDto.accessToken}` },
    });
  } catch (error) {
    Promise.reject(error);
  }
}
