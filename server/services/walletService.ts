import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";
import { catchErrorHandler } from "@/utils/errorHandler";
import * as bonusService from "./bonusService";
import {
  REGISTRATION_BONUS,
  REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
} from "@/app/constants/constants";

export const createWallet = async ({
  userId,
  invitedByFriend,
}: {
  userId: number;
  invitedByFriend: boolean;
}) => {
  try {
    const candidate = await prisma.wallet.findUnique({ where: { userId } });

    if (candidate) {
      throw ApiError.badRequest(
        "Кошелек для пользователя уже зарегистрирован в базе"
      );
    }

    const wallet = await prisma.wallet.create({
      data: { userId },
    });

    await bonusService.createBonus({
      userId,
      bonusType: "REGISTRATION",
      amount: REGISTRATION_BONUS,
    });

    {
      invitedByFriend &&
        (await bonusService.createBonus({
          userId,
          bonusType: "REGISTRATION_WITH_REFERRAL_EMAIL",
          amount: REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
        }));
    }

    return wallet;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при создании кошелька пользователя",
    });
  }
};

export const getWallet = async ({ userId }: { userId: number }) => {
  try {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });

    if (!wallet) {
      throw ApiError.badRequest("Кошелек не зарегистрирован в базе");
    }

    return wallet;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при поиске кошелька пользователя",
    });
  }
};

export const addBonusAmountToWallet = async ({
  userId,
  amount,
}: {
  userId: number;
  amount: number;
}) => {
  try {
    const wallet = await getWallet({ userId });

    if (!wallet) {
      throw ApiError.badRequest("Кошелек не зарегистрирован в базе");
    }

    await prisma.wallet.update({
      where: { userId },
      data: { bonusAmount: (wallet.bonusAmount || 0) + amount },
    });

    return wallet;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при добавлении бонуса в кошелек пользователя",
    });
  }
};
