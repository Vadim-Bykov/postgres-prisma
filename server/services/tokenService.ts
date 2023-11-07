import { UserDto } from "../dtos/userDto";
import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";
import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "@reduxjs/toolkit";
import {
  getJwtAccessSecretKey,
  getJwtRefreshSecretKey,
} from "../helpers/token";

const JWT_ACCESS_SECRET = getJwtAccessSecretKey();
const JWT_REFRESH_SECRET = getJwtRefreshSecretKey();

export const generateToken = async (payload: UserDto) => {
  const refreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuer(JSON.stringify(payload))
    .setIssuedAt()
    .setExpirationTime("30d")
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

// export const findRefreshToken = async (refreshToken: string) => {
//   const tokenData = await prisma.token.findUnique({ where: { refreshToken } });
//   return tokenData;
// };

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
    return ApiError.badRequest("Your token has expired.", error);
  }
};

export const removeRefreshToken = async (refreshToken: string) => {
  try {
    const tokenData = await prisma.token.delete({ where: { refreshToken } });

    if (!tokenData) {
      return { warning: `This user was logged out earlier` };
    }

    return tokenData;
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
    throw ApiError.badRequest(error?.message, error);
  }
};
