// import { ApiError } from './../errors/ApiError';
import jwt from "jsonwebtoken";
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
  // const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET as string, {
  //   expiresIn: "5h",
  // });
  // const accessToken = await new SignJWT({})
  //   .setProtectedHeader({ alg: "HS256" })
  //   .setJti(nanoid())
  //   .setIssuedAt()
  //   .setIssuer(payload.email)
  //   .setExpirationTime("5h")
  //   .sign(new TextEncoder().encode(JWT_ACCESS_SECRET));

  // const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET as string, {
  //   expiresIn: "30d",
  // });
  const refreshToken = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuer(payload.email)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(JWT_REFRESH_SECRET));

  return { refreshToken };
};

export const saveRefreshToken = async (
  userId: number,
  refreshToken: string
) => {
  const tokenData = await findRefreshTokenByUserId(userId);
  if (tokenData) {
    const updatedTokenData = await prisma.token.update({
      where: { refreshToken: tokenData.refreshToken },
      data: { refreshToken },
    });

    return updatedTokenData;
  }

  await prisma.token.create({ data: { refreshToken, userId } });
};

export const findRefreshTokenByUserId = async (userId: number) => {
  const tokenData = await prisma.token.findFirst({ where: { userId } });
  return tokenData;
};

export const validateRefreshToken = async (refreshToken: string) => {
  try {
    const { payload } = await jwtVerify(
      refreshToken,
      new TextEncoder().encode(JWT_REFRESH_SECRET)
    );
    console.log({ validateRefreshToken: payload });

    return payload;
  } catch (error) {
    return ApiError.badRequest("Your token has expired.");
  }
};

// export const validateAccessToken = async (accessToken: string) => {
//   try {
//     // const userData = jwt.verify(accessToken, JWT_ACCESS_SECRET as string);
//     // console.log({ validateAccessToken: userData });
//     const { payload } = await jwtVerify(
//       accessToken,
//       new TextEncoder().encode(JWT_ACCESS_SECRET)
//     );
//     console.log({ validateAccessToken: payload });

//     return payload;

//     // return userData as UserDto;
//   } catch (error: any) {
//     return ApiError.badRequest("Your token has expired.");
//   }
// };

export const removeRefreshToken = async (refreshToken: string) => {
  try {
    const tokenData = await prisma.token.delete({ where: { refreshToken } });

    if (!tokenData) {
      return { warning: `This user was logged out earlier` };
    }

    return tokenData;
  } catch (error: any) {
    throw ApiError.badRequest(error?.message);
  }
};

export const findRefreshToken = async (refreshToken: string) => {
  try {
    const tokenData = await prisma.token.findUnique({
      where: { refreshToken },
    });

    return tokenData;
  } catch (error: any) {
    throw ApiError.badRequest(error?.message);
  }
};
