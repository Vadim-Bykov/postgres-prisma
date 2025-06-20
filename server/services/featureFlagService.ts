import prisma from "@/lib/prisma";
import { catchErrorHandler } from "@/utils/errorHandler";

export const getAllFeatureFlags = async () => {
  try {
    const featureFlags = await prisma.featureFlag.findMany();

    return featureFlags;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при получении данных пользователей из базы.",
    });
  }
};
