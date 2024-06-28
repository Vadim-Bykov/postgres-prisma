import prisma from "@/lib/prisma";
import { catchErrorHandler } from "@/utils/errorHandler";
import { ApiError } from "../error/ApiError";

export const createWallet = async ({
  userId,
}: {
  userId: number;
  invitedByFriend?: boolean;
  registrationFlow?: boolean;
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
    let wallet = await getWallet({ userId });

    if (!wallet) {
      wallet = await createWallet({ userId });
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
