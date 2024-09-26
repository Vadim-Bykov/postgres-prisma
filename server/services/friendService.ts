import prisma from "@/lib/prisma";
import { catchErrorHandler } from "@/utils/errorHandler";
import { ApiError } from "../error/ApiError";
import { getFriendDto } from "../dtos/friendDto";

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
      include: { users: true },
    });

    return friends.map(getFriendDto);
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при поиске друзей пользователя",
    });
  }
};

export const getFriendObject = async ({
  userId,
  invitedByFriendEmail,
}: {
  userId: number;
  invitedByFriendEmail: string;
}) => {
  try {
    const friends = await prisma.friend.findUnique({
      where: { userId, invitedByFriendEmail },
      include: { friend: true },
    });

    return friends;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при поиске друга в в базе",
    });
  }
};
