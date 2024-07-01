import messages from "@/app/constants/messages.json";
import prisma from "@/lib/prisma";
import { PurchaseBody } from "@/models/purchase";
import * as cookieService from "@/server/services/cookieService";
import { NextResponse } from "next/server";
import { ApiError } from "../error/ApiError";
import * as bonusService from "./bonusService";
import * as walletService from "./walletService";
import * as consultationService from "./consultationService";
import * as mailService from "./mailService";
import { PERCENTAGE_TO_PAY_BY_BONUS } from "@/app/constants/constants";

export const getAllUserPurchases = async () => {
  try {
    const userData = await cookieService.getUserDataFromCookies();

    const purchases = await prisma.purchase.findMany({
      where: { userId: userData.id },
      orderBy: { createdAt: "desc" },
      include: { consultation: true },
    });

    return purchases;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при получении покупок пользователя из базы",
        error
      );
    }
  }
};

export const createPurchase = async ({
  bankRecipientId,
  consultationId,
  paymentNumber,
  paidByBonus,
}: PurchaseBody) => {
  try {
    const userData = await cookieService.getUserDataFromCookies();

    const user = await prisma.users.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${userData.email} не зарегистрирован в базе`
      );
    }

    const boughtPreviouslyPurchase = await prisma.purchase.findFirst({
      where: {
        userId: userData.id,
        consultationId,
        bankRecipientId,
        paymentNumber,
      },
    });

    if (boughtPreviouslyPurchase) {
      throw ApiError.badRequest(
        `Ты уже отправил эту оплату на проверку. ${
          messages.payments[boughtPreviouslyPurchase.paymentStatus]
        }`
      );
    }

    const consultation = await consultationService.getConsultation(
      consultationId
    );
    const consultationPrice = consultation?.price;

    if (paidByBonus) {
      const percentageRequestedToPayByBonus =
        (paidByBonus / consultationPrice) * 100;

      if (percentageRequestedToPayByBonus > PERCENTAGE_TO_PAY_BY_BONUS)
        throw ApiError.badRequest(
          `Баллами можно оплатить только ${PERCENTAGE_TO_PAY_BY_BONUS}% от стоимости консультации, что составляет ${
            (consultationPrice * PERCENTAGE_TO_PAY_BY_BONUS) / 100
          } ${consultation.currency}.`
        );

      await walletService.subtractAmountFromWallet({
        userId: user.id,
        amount: paidByBonus,
      });
    }

    const [purchase] = await Promise.all([
      prisma.purchase.create({
        data: {
          userId: userData.id,
          consultationId,
          bankRecipientId,
          paymentNumber,
          paidByMoney: consultationPrice - (paidByBonus || 0),
          paidByBonus,
        },
        // include: { consultation: true },
      }),
      // mailService.sendCheckingPurchaseMail({
      //   name: userData.name,
      //   email: userData.email,
      //   consultationId,
      // }),
    ]);

    !!user.invitedByFriendEmail &&
      (await bonusService.createPurchaseBonusForFriend({
        purchasePrice: consultationPrice - (paidByBonus || 0),
        purchaseId: purchase.id,
        userId: user.id,
        invitedByFriendEmail: user.invitedByFriendEmail,
      }));

    return purchase;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при создании покупки пользователя в базе",
        error
      );
    }
  }
};

export const getUserPurchase = async (consultationId: number) => {
  try {
    const userData = await cookieService.getUserDataFromCookies();

    const purchase = await prisma.purchase.findFirst({
      where: { consultationId, userId: userData.id },
      include: { consultation: true },
    });

    return purchase;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при обновлении данных покупки пользователя из базы",
        error
      );
    }
  }
};

export const updateUserPurchase = async ({
  bankRecipientId,
  consultationId,
  paymentNumber,
}: PurchaseBody) => {
  try {
    const userData = await cookieService.getUserDataFromCookies();
    const [userPurchase, boughtPreviouslyPurchase] = await Promise.all([
      prisma.purchase.findFirst({
        where: { consultationId, userId: userData.id },
      }),
      prisma.purchase.findFirst({
        where: {
          userId: userData.id,
          consultationId,
          bankRecipientId,
          paymentNumber,
        },
      }),
    ]);

    if (!userPurchase) {
      throw ApiError.badRequest(
        "Ваши предыдущие сведения об оплате не найдены"
      );
    }

    if (boughtPreviouslyPurchase) {
      throw ApiError.badRequest(
        `Ты уже отправил эту оплату на проверку. ${
          messages.payments[boughtPreviouslyPurchase.paymentStatus]
        }`
      );
    }

    const [purchase] = await Promise.all([
      prisma.purchase.update({
        where: { id: userPurchase.id },
        data: {
          bankRecipientId,
          consultationId,
          paymentNumber,
          updatedAt: new Date().toISOString(),
        },
      }),
      // await mailService.sendCheckingPurchaseMail({
      //   name: userData.name,
      //   email: userData.email,
      //   consultationId,
      //   isProvidedDataUpdate: true,
      // }),
    ]);

    return purchase;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при обновлении данных покупки пользователя в базе",
        error
      );
    }
  }
};
