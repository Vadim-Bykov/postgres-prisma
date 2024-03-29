import { NewConsultationEmailBody } from "@/models/email";
import * as mailService from "@/server/services/mailService";
import { apiCatchErrorHandler } from "@/utils/errorHandler";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const consultationEmailBody: NewConsultationEmailBody =
      await request.json();

    const numberOfEmailedUser =
      await mailService.sendNewConsultationEmailToAllUsers(
        consultationEmailBody
      );

    return NextResponse.json({
      message: `Новая консультация разослана ${numberOfEmailedUser} пользователям.`,
    });
  } catch (error) {
    return apiCatchErrorHandler({
      error,
      message:
        "Ошибка при отправке запроса на рассылку и-мэйлов с новой консультацией",
    });
  }
}
