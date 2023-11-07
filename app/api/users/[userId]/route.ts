import prisma from "@/lib/prisma";
import { removeTokensFromCookies } from "@/server/services/cookieService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const users = await prisma.users.findUnique({ where: { id: +userId } });

  return Response.json(users);
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const users = await prisma.users.delete({ where: { id: +userId } });

  // TODO: uncomment after implementing close account feature
  // removeTokensFromCookies();

  return NextResponse.json(users);
}
