import { ApiError } from "@/server/error/ApiError";
import { NextResponse } from "next/server";

export const catchErrorHandler = ({
  error,
  message,
}: {
  error: any;
  message: string;
}) => {
  if (error instanceof NextResponse) {
    throw error;
  } else {
    throw ApiError.badRequest(message, error);
  }
};

export const apiCatchErrorHandler = ({
  error,
  message,
}: {
  error: any;
  message: string;
}) => {
  if (error instanceof NextResponse) {
    return error;
  } else {
    return ApiError.badRequest(message, error);
  }
};
