import { User } from "@/models/users";
import { ApiError } from "@/server/error/ApiError";
import * as userService from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";

const url = process.env.VERCEL_URL!;

export async function GET(
  request: Request,
  { params }: { params: { link: string } }
) {
  try {
    const { link } = params;

    const passwordData = await userService.resetUserPassword(link);

    // return NextResponse.redirect(url);
    return NextResponse.json(passwordData);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Reset link request error", error);
    }
  }
}
