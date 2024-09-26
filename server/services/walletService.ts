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

    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        bonusAmount: (wallet.bonusAmount || 0) + amount,
        updatedAt: new Date().toISOString(),
      },
    });

    return updatedWallet;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при добавлении бонуса в кошелек пользователя",
    });
  }
};

export const subtractAmountFromWallet = async ({
  userId,
  amount,
}: {
  userId: number;
  amount: number;
}) => {
  try {
    let wallet = await getWallet({ userId });

    if (!wallet) {
      throw ApiError.badRequest(
        "Кошелек не зарегистрирован в базе. Чтобы списать бонусные баллы у вас должен быть кошелек."
      );
    }

    if (!wallet.bonusAmount || wallet.bonusAmount < amount) {
      throw ApiError.badRequest(
        `На вашем счету меньше баллов чем вы предлагаете к списанию. У вас на счету ${wallet.bonusAmount} баллов, а вы предлагаете списать ${amount}. `
      );
    }

    const updatedWallet = await prisma.wallet.update({
      where: { userId },
      data: {
        bonusAmount: wallet.bonusAmount - amount,
        updatedAt: new Date().toISOString(),
      },
    });

    return updatedWallet;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при добавлении бонуса в кошелек пользователя",
    });
  }
};
