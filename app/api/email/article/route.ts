import { ArticleEmailBody } from "@/models/email";
import * as mailService from "@/server/services/mailService";
import { apiCatchErrorHandler } from "@/utils/errorHandler";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const articleEmailBody: ArticleEmailBody = await request.json();

    const numberOfEmailedUser = await mailService.sendArticleMailToAllUsers(
      articleEmailBody
    );

    return NextResponse.json({
      message: `Статья разослана ${numberOfEmailedUser} пользователям.`,
    });
  } catch (error) {
    return apiCatchErrorHandler({
      error,
      message: "Ошибка при отправке запроса на рассылку и-мэйлов со статьей",
    });
  }
}
