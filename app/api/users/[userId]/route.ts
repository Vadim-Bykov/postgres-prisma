import prisma from "@/lib/prisma";
import { removeTokensFromCookies } from "@/server/services/cookieService";
import * as userService from "@/server/services/userService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const user = await userService.getUser(+userId);

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const users = await prisma.users.delete({ where: { id: +userId } });

  // TODO: uncomment after implementing close account feature
  removeTokensFromCookies();

  return NextResponse.json(users);
}
