import prisma from "@/lib/prisma";
import { UserCreationBody } from "@/models/users";
import { setTokensToCookies } from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";

export async function GET() {
  const users = await userService.getAllUsers();

  return Response.json(users);
}

export async function POST(request: Request) {
  try {
    const userData: UserCreationBody = await request.json();

    const userDto = await userService.registration(userData);
    const { accessToken, refreshToken } = userDto;

    setTokensToCookies({ refreshToken });

    return Response.json(userDto);

    // return new Response(JSON.stringify(userDto), {
    //   status: 200,
    //   headers: { Authorization: `Token ${userDto.accessToken}` },
    // });
  } catch (error) {
    Promise.reject(error);
  }
}
