import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/app/constants/constants";
import { cookies } from "next/headers";
import { ApiError } from "../error/ApiError";
import * as tokenService from "./tokenService";

export const setTokensToCookies = ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const cookieStore = cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
};

export const removeTokensFromCookies = () => {
  const cookieStore = cookies();
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  // cookieStore.delete(ACCESS_TOKEN_COOKIE);
};

export const getTokensFromCookies = () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  return refreshToken;
};

export const getUserDataFromCookies = async () => {
  const refreshToken = getTokensFromCookies();

  if (!refreshToken) {
    throw ApiError.badRequest("No refreshToken in Purchase request");
  }
  const userData = await tokenService.validateRefreshToken(refreshToken);

  return userData;
};
