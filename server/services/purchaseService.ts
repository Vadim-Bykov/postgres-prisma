import messages from "@/app/constants/messages.json";
import prisma from "@/lib/prisma";
import { PurchaseBody } from "@/models/purchase";
import * as cookieService from "@/server/services/cookieService";
import { NextResponse } from "next/server";
import { ApiError } from "../error/ApiError";
import * as mailService from "./mailService";

export const getAllUserPurchases = async () => {
  try {
    const userData = await cookieService.getUserDataFromCookies();

    const purchases = await prisma.purchase.findMany({
      where: { userId: userData.id },
      include: { consultation: true },
    });

    return purchases;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest("getAllUserPurchases error", error);
    }
  }
};

export const createPurchase = async ({
  bankRecipientId,
  consultationId,
  paymentNumber,
}: PurchaseBody) => {
  try {
    const userData = await cookieService.getUserDataFromCookies();

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

    const [purchase] = await Promise.all([
      prisma.purchase.create({
        data: {
          userId: userData.id,
          consultationId,
          bankRecipientId,
          paymentNumber,
        },
      }),
      await mailService.sendCheckingPurchaseMail({
        name: userData.name,
        email: userData.email,
        consultationId,
      }),
    ]);

    return purchase;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest("createPurchase error", error);
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
      throw ApiError.badRequest("getUserPurchase error", error);
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
        },
      }),
      await mailService.sendCheckingPurchaseMail({
        name: userData.name,
        email: userData.email,
        consultationId,
        isProvidedDataUpdate: true,
      }),
    ]);

    return purchase;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest("updateUserPurchase error", error);
    }
  }
};
