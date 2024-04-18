import messages from "@/app/constants/messages.json";
import prisma from "@/lib/prisma";
import * as cookieService from "@/server/services/cookieService";
import * as tokenService from "@/server/services/tokenService";
import { NextResponse } from "next/server";
import { ApiError } from "../error/ApiError";

export const getBankingData = async () => {
  try {
    const refreshToken = cookieService.getTokensFromCookies();

    if (!refreshToken) {
      throw ApiError.unauthorized();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);

    if (userData instanceof NextResponse) {
      throw userData;
    }
    const user = await prisma.users.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${userData.email} не зарегистрирован в базе`
      );
    }

    // if (
    //   (!userData.location || userData.location?.country === "BY") &&
    //   userData.role !== "ADMIN"
    // ) {
    //   throw ApiError.badRequest(messages.location);
    // }

    const banking = await prisma.banking.findMany();

    return banking;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest(
        "Ошибка при получении банковских данных",
        error
      );
    }
  }
};
