import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";

export const getBankingData = async () => {
  try {
    const banking = await prisma.banking.findMany();

    return banking;
  } catch (error) {
    throw ApiError.badRequest("getBankingData error", error);
  }
};
