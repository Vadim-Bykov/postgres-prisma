import prisma from "@/lib/prisma";
import { ApiError } from "../error/ApiError";
import { catchErrorHandler } from "@/utils/errorHandler";
import { Consultation } from "@prisma/client";
import { getEnvironment } from "../helpers/envKeys";

export const getAllConsultations = async () => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: {
        status: getEnvironment() === "production" ? "PUBLISHED" : undefined,
      },
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

    if (!consultation) {
      throw ApiError.badRequest(`Консультация с ID: ${id} не сохранена в базе`);
    }

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

export const createConsultationEmail = async (consultation: Consultation) => {
  try {
    const consultationEmailData = await prisma.consultationEmail.create({
      data: {
        title: consultation.title,
        consultationId: consultation.id,
      },
    });

    return consultationEmailData;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при создании и-мэйла для консультации в базе",
    });
  }
};

export const getConsultationEmail = async (consultationId: number) => {
  try {
    const consultation = await getConsultation(consultationId);
    if (!consultation) {
      throw ApiError.badRequest(
        `Консультация с ID: ${consultationId} не сохранена в базе`
      );
    }

    const existedConsultationEmailData =
      await prisma.consultationEmail.findUnique({
        where: { consultationId },
      });

    if (existedConsultationEmailData) {
      return { consultationEmail: existedConsultationEmailData, consultation };
    } else {
      const createdConsultationEmailData = await createConsultationEmail(
        consultation
      );

      return { consultationEmail: createdConsultationEmailData, consultation };
    }
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при поиске и-мэйла для консультации в базе",
    });
  }
};
