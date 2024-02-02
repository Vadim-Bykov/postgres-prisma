import { PurchaseBody } from "@/models/purchase";
import * as cookieService from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { ApiError } from "../error/ApiError";
import prisma from "@/lib/prisma";
import * as mailService from "./mailService";
import { NextResponse } from "next/server";
import messages from "@/app/constants/messages.json";

export const getAllUserPurchases = async () => {
  try {
    const userData = await cookieService.getUserDataFromCookies();

    const purchases = await prisma.purchase.findMany({
      where: { userId: userData.id },
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

    const purchase = await prisma.purchase.create({
      data: {
        userId: userData.id,
        consultationId,
        bankRecipientId,
        paymentNumber,
      },
    });

    //  mailService.sendActivationMail()

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
    const userPurchase = await prisma.purchase.findFirst({
      where: { consultationId, userId: userData.id },
    });
    if (!userPurchase) {
      throw ApiError.badRequest(
        "Ваши предыдущие сведения об оплате не найдены"
      );
    }
    const purchase = await prisma.purchase.update({
      where: { id: userPurchase.id },
      data: {
        bankRecipientId,
        consultationId,
        paymentNumber,
      },
    });

    return purchase;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest("updateUserPurchase error", error);
    }
  }
};
