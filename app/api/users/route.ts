import prisma from "@/lib/prisma";
import { Prisma, users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
  const users = await prisma.users.findMany();

  return Response.json(users);
}

interface ApiRequest extends NextApiRequest {
  body: users;
}

export async function POST(request: Request) {
  try {
    const userData: users = await request.json();
    const { email, name } = userData;

    const user = await prisma.users.create({ data: { email, name } });

    return Response.json(user);
  } catch (error) {
    Promise.reject(error);
  }
}
