import { REFRESH_TOKEN_COOKIE } from "@/app/constants/constants";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../error/ApiError";
import { validateRefreshToken } from "../services/tokenService";

export class AuthError extends Error {}

export const authMiddleware = async (req: NextRequest) => {
  // const ResponseNext = NextResponse.next;
  // const ResponseError = NextResponse.error;

  try {
    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    console.log({ refreshToken });

    if (!refreshToken) {
      return ApiError.unauthorized();
    }
    const userData = await validateRefreshToken(refreshToken);

    // const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    // console.log({ accessToken });
    // if (!accessToken) {
    //   return ResponseNext(ApiError.unauthorized());
    // }

    // const userData = await validateAccessToken(accessToken);
    console.log({ userData });

    if (!userData) {
      return Response.json(
        { success: false, message: "authentication failed" },
        { status: 401 }
      );
      // return ResponseNext(ApiError.unauthorized());
    }
  } catch (error: any) {
    console.log({ error });
    return ApiError.internal("Some internal error occurred in auth", error);
  }
};
