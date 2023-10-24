import prisma from "@/lib/prisma";
import { removeTokensFromCookies } from "@/server/services/cookieService";

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

  removeTokensFromCookies();

  return Response.json(users);
}
