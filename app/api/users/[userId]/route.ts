import prisma from "@/lib/prisma";
import { User } from "@/models/users";

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

  return Response.json(users);
}
