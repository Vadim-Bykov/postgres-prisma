import { PurchaseBody } from "@/models/purchase";
import * as cookieService from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { ApiError } from "../error/ApiError";
import prisma from "@/lib/prisma";
import * as mailService from "./mailService";
import { NextResponse } from "next/server";

export const getAllUserPurchases = async () => {
  try {
    const refreshToken = cookieService.getTokensFromCookies();

    if (!refreshToken) {
      throw ApiError.badRequest("No refreshToken in Purchase request");
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    if (userData instanceof NextResponse) {
      throw userData;
    }

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
    const refreshToken = cookieService.getTokensFromCookies();

    if (!refreshToken) {
      throw ApiError.badRequest("No refreshToken in Purchase request");
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    if (userData instanceof NextResponse) {
      throw userData;
    }

    const equalPurchase = await prisma.purchase.findFirst({
      where: {
        userId: userData.id,
        consultationId,
        bankRecipientId,
        paymentNumber,
      },
    });

    if (equalPurchase) {
      throw ApiError.badRequest(
        "Ты уже отправил эту оплату на проверку. Мы проверим оплату в течении суток и свяжемся с тобой. Спасибо за оплату!"
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
