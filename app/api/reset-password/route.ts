import { User } from "@/models/users";
import { ApiError } from "@/server/error/ApiError";
import * as userService from "@/server/services/userService";
import { NextRequest, NextResponse } from "next/server";

export interface ResetPasswordData {
  link: string | null;
}

export async function PATCH(request: NextRequest) {
  try {
    const { email }: { email: User["email"] } = await request.json();

    const passwordData: ResetPasswordData =
      await userService.getResetPasswordLink(email);

    return NextResponse.json({
      message: "Link to reset password is sent",
      ...passwordData,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      return ApiError.badRequest("Reset password request error", error);
    }
  }
}
