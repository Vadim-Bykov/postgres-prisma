// import { ApiError } from './../errors/ApiError';
import jwt from "jsonwebtoken";
import { UserDto } from "../dtos/userDto";
import prisma from "@/lib/prisma";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateToken = (payload: UserDto) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET as string, {
    expiresIn: "5h",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET as string, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
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

export const validateRefreshToken = (refreshToken: string) => {
  try {
    const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET as string);

    return userData as UserDto;
  } catch (error) {
    return null;
  }
};

export const validateAccessToken = (accessToken: string) => {
  try {
    const userData = jwt.verify(accessToken, JWT_ACCESS_SECRET as string);

    return userData as UserDto;
  } catch (error) {
    return null;
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
    // throw ApiError.badRequest(error?.message);
  }
};

export const findRefreshToken = async (refreshToken: string) => {
  try {
    const tokenData = await prisma.token.findUnique({
      where: { refreshToken },
    });

    return tokenData;
  } catch (error: any) {
    // throw ApiError.badRequest(error?.message);
  }
};
