import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";

export const getAllConsultations = async () => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { primary: "desc" },
    });

    return consultations;
  } catch (error) {
    throw ApiError.badRequest(
      "Ошибка при получении данных консультаций",
      error
    );
  }
};

export const getConsultation = async (id: number) => {
  try {
    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    return consultation;
  } catch (error) {
    throw ApiError.badRequest(
      "Ошибка при получении данных консультации",
      error
    );
  }
};

export const deprecateConsultation = async (id: number) => {
  try {
    const consultation = await prisma.consultation.update({
      where: { id },
      data: { status: "DEPRECATED" },
    });

    return consultation;
  } catch (error) {
    throw ApiError.badRequest("deprecateConsultation error", error);
  }
};
