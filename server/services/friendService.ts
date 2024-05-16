import prisma from "@/lib/prisma";
import { catchErrorHandler } from "@/utils/errorHandler";
import { ApiError } from "../error/ApiError";

export const createFriend = async ({
  userId,
  invitedByFriendEmail,
}: {
  userId: number;
  invitedByFriendEmail: string;
}) => {
  try {
    const friend = await prisma.friend.create({
      data: { invitedByFriendEmail, userId },
    });

    return friend;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: `Ошибка в базе при создании друга для пользователя ${invitedByFriendEmail}`,
    });
  }
};

export const getAllFriends = async ({ email }: { email: string }) => {
  try {
    const friends = await prisma.friend.findMany({
      where: { invitedByFriendEmail: email },
    });

    return friends;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при поиске друзей пользователя",
    });
  }
};
