import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";
import { catchErrorHandler } from "@/utils/errorHandler";
import { BonusType } from "@prisma/client";
import * as walletService from "./walletService";
import * as friendService from "./friendService";
import { PERCENTAGE_FROM_FRIEND_PURCHASE } from "@/app/constants/constants";

export const createBonus = async ({
  userId,
  amount,
  bonusType,
  purchasePrice,
  purchaseId,
}: {
  userId: number;
  amount: number;
  bonusType: BonusType;
  purchasePrice?: number;
  purchaseId?: number;
}) => {
  try {
    const bonus = await prisma.bonus.create({
      data: {
        userId,
        amount,
        type: bonusType,
        purchasePrice,
        purchaseId,
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
    });

    return bonus;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при создании бонуса",
    });
  }
};
