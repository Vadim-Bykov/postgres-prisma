import prisma from "@/lib/prisma";
import { UserCreationBody } from "@/models/users";

export async function GET() {
  const users = await prisma.users.findMany();

  return Response.json(users);
}

export async function POST(request: Request) {
  try {
    const userData: UserCreationBody = await request.json();
    const { email, name } = userData;

    const user = await prisma.users.create({ data: { email, name } });

    return Response.json(user);
  } catch (error) {
    Promise.reject(error);
  }
}
