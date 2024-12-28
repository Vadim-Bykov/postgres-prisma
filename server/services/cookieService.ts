import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/app/constants/constants";
import { cookies } from "next/headers";
import { ApiError } from "../error/ApiError";
import * as tokenService from "./tokenService";

export const setTokensToCookies = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

export const removeTokensFromCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  // cookieStore.delete(ACCESS_TOKEN_COOKIE);
};

export const getTokensFromCookies = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  return refreshToken;
};

export const getUserDataFromCookies = async () => {
  const refreshToken = await getTokensFromCookies();

  if (!refreshToken) {
    throw ApiError.unauthorized();
  }
  const userData = await tokenService.validateRefreshToken(refreshToken);

  return userData;
};
