import { UserDto } from "../dtos/userDto";
import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";
import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "@reduxjs/toolkit";
import { getJwtRefreshSecretKey } from "../helpers/token";
import { Token } from "@prisma/client";
import * as cookieService from "./cookieService";

// const JWT_ACCESS_SECRET = getJwtAccessSecretKey();
const JWT_REFRESH_SECRET = getJwtRefreshSecretKey();

export const generateToken = async (payload: UserDto) => {
  const refreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuer(JSON.stringify(payload))
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(new TextEncoder().encode(JWT_REFRESH_SECRET));

  return { refreshToken };
};

export const saveRefreshToken = async ({
  userId,
  refreshToken,
  updatedRefreshToken,
}: {
  userId: number;
  refreshToken: string;
  updatedRefreshToken?: string;
}) => {
  const tokenData = await findRefreshToken(refreshToken);

  if (tokenData && updatedRefreshToken) {
    const updatedTokenData = await prisma.token.update({
      where: { refreshToken },
      data: { refreshToken: updatedRefreshToken },
    });

    return updatedTokenData;
  } else {
    const createdTokenData = await prisma.token.create({
      data: { refreshToken, userId },
    });
    return createdTokenData;
  }
};

export const validateRefreshToken = async (refreshToken: string) => {
  try {
    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(JWT_REFRESH_SECRET)
    );

    const userDto: UserDto = payload.iss && JSON.parse(payload.iss);

    return userDto;
  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
      removeRefreshToken(refreshToken);
    }
    throw ApiError.unauthorized();
  }
};

export const removeRefreshToken = async (refreshToken: string) => {
  try {
    cookieService.removeTokensFromCookies();

    const tokenData = await prisma.token.delete({ where: { refreshToken } });

    if (!tokenData) {
      return { warning: "Пользователь уже вышел из аккаунта" };
    }

    return tokenData;
  } catch (error: any) {
    throw ApiError.badRequest(error?.message, error);
  }
};

export const removeAllRefreshToken = async (userId: number) => {
  try {
    const tokenData = await prisma.token.deleteMany({ where: { userId } });

    if (!tokenData) {
      return { warning: "Пользователь уже вышел из аккаунта" };
    }

    return { numberOfRemovedTokens: tokenData.count };
  } catch (error: any) {
    throw ApiError.badRequest(error?.message, error);
  }
};

export const findRefreshToken = async (refreshToken: string) => {
  try {
    const tokenData = await prisma.token.findUnique({
      where: { refreshToken },
    });

    return tokenData;
  } catch (error: any) {
    throw ApiError.badRequest("Ошибка при поиске токена в базе.", error);
  }
};

export const updateRefreshToken = async ({
  userId,
  newRefreshToken,
  oldRefreshToken,
}: {
  userId: number;
  newRefreshToken: string;
  oldRefreshToken?: string;
}) => {
  try {
    const tokenData = oldRefreshToken
      ? await findRefreshToken(oldRefreshToken)
      : await findRefreshTokenByUserId(userId);

    if (tokenData) {
      const updatedTokenData = await prisma.token.update({
        where: { refreshToken: tokenData.refreshToken },
        data: { refreshToken: newRefreshToken },
      });

      return updatedTokenData;
    } else {
      const createdTokenData = await prisma.token.create({
        data: { refreshToken: newRefreshToken, userId },
      });
      return createdTokenData;
    }
  } catch (error) {
    throw ApiError.badRequest("Ошибка при обновлении токена в базе.", error);
  }
};

export const findRefreshTokenByUserId = async (userId: number) => {
  try {
    const tokenData = await prisma.token.findFirst({
      where: { userId },
    });

    return tokenData;
  } catch (error: any) {
    throw ApiError.badRequest("Ошибка при поиске токена в базе.", error);
  }
};

export const compareRefreshTokenWithSavedInDb = async (
  refreshToken: string
) => {
  try {
    const userData = await validateRefreshToken(refreshToken);

    const tokenData = await prisma.token.findUnique({
      where: { refreshToken },
    });

    if (tokenData) {
      return true;
    }

    const tokenDataUserId = await findRefreshTokenByUserId(userData.id);
    if (tokenDataUserId) {
      const userDataFromDbToken = await validateRefreshToken(
        tokenDataUserId.refreshToken
      );

      const isTokenValid =
        JSON.stringify(userData) === JSON.stringify(userDataFromDbToken);

      return isTokenValid;
    }

    return false;
  } catch (error: any) {
    throw ApiError.badRequest("Ошибка при валидации токена в базе.", error);
  }
};
