import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";
import { catchErrorHandler } from "@/utils/errorHandler";
import { BonusType } from "@prisma/client";
import * as walletService from "./walletService";

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
