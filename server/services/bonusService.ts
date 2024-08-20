import { PERCENTAGE_FROM_FRIEND_PURCHASE } from "@/app/constants/constants";
import prisma from "@/lib/prisma";
import { catchErrorHandler } from "@/utils/errorHandler";
import { BonusType } from "@prisma/client";
import * as consultationService from "./consultationService";
import * as friendService from "./friendService";
import * as walletService from "./walletService";

export const createBonus = async ({
  userId,
  amount,
  bonusType,
  purchasePrice,
  purchaseId,
  friendId,
}: {
  userId: number;
  amount: number;
  bonusType: BonusType;
  purchasePrice?: number;
  purchaseId?: number;
  friendId?: number;
}) => {
  try {
    const bonus = await prisma.bonus.create({
      data: {
        userId,
        amount,
        type: bonusType,
        purchasePrice,
        purchaseId,
        friendId,
      },
    });

    await walletService.addBonusAmountToWallet({ userId, amount });

    return bonus;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при создании бонуса",
    });
  }
};

export const createPurchaseBonusForFriend = async ({
  userId,
  invitedByFriendEmail,
  purchaseId,
  purchasePrice,
}: {
  userId: number;
  invitedByFriendEmail: string;
  purchasePrice: number;
  purchaseId: number;
}) => {
  try {
    const friend = await friendService.getFriendObject({
      invitedByFriendEmail,
      userId,
    });

    if (!friend?.friend) {
      return;
    }

    const bonus = await createBonus({
      userId: friend.friend.id,
      bonusType: "FRIEND_S_PURCHASE",
      amount: (purchasePrice * PERCENTAGE_FROM_FRIEND_PURCHASE) / 100,
      purchaseId,
      purchasePrice,
      friendId: friend.id,
    });

    return bonus;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при создании бонуса",
    });
  }
};

export const getBonusesFromFriend = async (friendObjectId: number) => {
  try {
    const bonuses = await prisma.bonus.findMany({
      where: { friendId: friendObjectId },
      include: { purchase: true },
    });

    const consultations = await consultationService.getAllConsultations();

    return bonuses.map((bonus) => ({
      ...bonus,
      consultationName: consultations.find(
        (consultation) => consultation.id === bonus.purchase?.consultationId
      )?.title,
      purchase: undefined,
    }));
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при создании бонуса",
    });
  }
};

export const getUserBonuses = async (userId: number) => {
  try {
    const bonuses = await prisma.bonus.findMany({
      where: { userId },
    });

    return bonuses;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при создании бонуса",
    });
  }
};

export const markViewedBonus = async (bonusId: number, userId: number) => {
  try {
    const bonuses = await prisma.bonus.update({
      where: { id: bonusId, userId },
      data: { viewed: true },
    });

    return bonuses;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при отметке просмотренного бонуса",
    });
  }
};
