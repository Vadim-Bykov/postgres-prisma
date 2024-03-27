import { ARTICLES } from "@/app/article/constants/articles";
import prisma from "@/lib/prisma";
import { catchErrorHandler } from "@/utils/errorHandler";
import { ApiError } from "../error/ApiError";

export const createArticle = async (articleId: number) => {
  const articleData = ARTICLES.find((article) => article.id === articleId);
  if (!articleData) {
    throw ApiError.badRequest(
      `Статья с ID: ${articleId} не сохранена в файле статей`
    );
  }

  try {
    const articleEmailData = await prisma.articleEmail.create({
      data: { title: articleData.title, articleId: articleData.id },
    });

    return articleEmailData;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при создании и-мэйла для статьи в базе",
    });
  }
};

export const getArticle = async (articleId: number) => {
  try {
    const existedArticleEmailData = await prisma.articleEmail.findUnique({
      where: { articleId },
    });

    if (existedArticleEmailData) {
      return existedArticleEmailData;
    } else {
      const createdArticleEmailData = await createArticle(articleId);

      return createdArticleEmailData;
    }
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при поиске и-мэйла для статьи в базе",
    });
  }
};
