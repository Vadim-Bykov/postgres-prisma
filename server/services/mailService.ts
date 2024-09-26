import { NewConsultationEmailBody } from "./../../models/email";
import { createTransport } from "nodemailer";
import * as consultationService from "./consultationService";
import { ApiError } from "../error/ApiError";
import { BRAND_NAME_STRING } from "@/app/constants/brand";
import { getEmailHtml } from "../helpers/email/emailTemplate";

const SMTP_HOST = process.env.VERCEL_SMTP_HOST!;
const SMTP_PORT = Number(process.env.VERCEL_SMTP_PORT)!;
const SMTP_USER = process.env.VERCEL_SMTP_USER!;
const SMTP_PASSWORD = process.env.VERCEL_SMTP_PASSWORD;
const API_URL = process.env.VERCEL_URL!;
import messages from "@/app/constants/messages.json";
import { ARTICLES, Article } from "@/app/article/constants/articles";
import * as userService from "./userService";
import { catchErrorHandler } from "@/utils/errorHandler";
import * as cookieService from "./cookieService";
import { ArticleEmailBody } from "@/models/email";
import { Consultation } from "@prisma/client";
import * as articleService from "./articleService";
import { formatGoogleDriveImageUrl } from "@/utils/formatting";

const transporter = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendActivationMail = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  // const urlLink = `${API_URL}/api/activate/${link}`;
  // <a href="${urlLink}" >${urlLink}</a>

  await transporter.sendMail({
    from: { address: SMTP_USER, name: BRAND_NAME_STRING },
    to: email,
    bcc: SMTP_USER,
    subject: `Регистрация на ${BRAND_NAME_STRING}`,
    html: getEmailHtml({
      name,
      text: "Рады тебя видеть частью нашей большой команды интересующейся астрологией.",
      emailPurpose: "REGISTRATION",
    }),
  });
};

export const sendResetPasswordLinkMail = async ({
  name,
  link,
  email,
}: {
  name: string;
  link: string;
  email: string;
}) => {
  try {
    const urlLink = `${API_URL}/reset-password/${link}`;

    await transporter.sendMail({
      from: { address: SMTP_USER, name: BRAND_NAME_STRING },
      to: email,
      bcc: SMTP_USER,
      subject: "Reset password link",
      html: getEmailHtml({
        name,
        text: `
          <p style="line-height: 140%;">Вы запросили сброс пароля в к вашему аккаунту ${email}!</p>
           <p style="line-height: 140%;">Чтобы сбросить пароль нажмите на ссылку: ${urlLink}</p>
           <p style="line-height: 140%;">Если вы не запрашивали сброс пароля - не нажимайте на ссылку выше</p>
           <p style="line-height: 140%;">После сброса, ваш пароль будет ${process
             .env.VERCEL_DEFAULT_RESET_PASSWORD!}</p>
           <h2>Вы сможете сменить ваш пароль на странице своего профиля</h2>
      `,
        emailPurpose: "PASSWORD_RESET",
      }),
    });
  } catch (error) {
    throw ApiError.badRequest(
      "Ошибка при отправке и-мэйла со ссылкой для сброса пароля",
      error
    );
  }
};

export const sendCheckingPurchaseMail = async ({
  name,
  email,
  consultationId,
  isProvidedDataUpdate,
}: {
  name: string;
  email: string;
  consultationId: number;
  isProvidedDataUpdate?: boolean;
}) => {
  try {
    const consultation = await consultationService.getConsultation(
      consultationId
    );

    const text = isProvidedDataUpdate
      ? `Вы обновили данные об оплате за консультацию${
          consultation
            ? " на тему " + (consultation.subTitle || consultation.title)
            : ""
        }.`
      : `Рады, что Вы обратились к нам за консультацией${
          consultation
            ? " на тему " + (consultation.subTitle || consultation.title)
            : ""
        }.`;

    await transporter.sendMail({
      from: { address: SMTP_USER, name: BRAND_NAME_STRING },
      to: email,
      bcc: SMTP_USER,
      subject: "Проверка оплаты консультации",
      html: getEmailHtml({
        name,
        text,
        extraMessage: messages.payments.CHECKING,
        emailPurpose: "PURCHASE",
      }),
    });
  } catch (error: any) {
    throw ApiError.badRequest("Ошибка при отправке и-мэйла", error);
  }
};

export const sendArticleMailToAllUsers = async ({
  articleId,
}: ArticleEmailBody) => {
  try {
    const user = await cookieService.getUserDataFromCookies();
    if (user.role !== "ADMIN") {
      throw ApiError.badRequest("У вас нет прав для отправки и-мэйла");
    }

    const users = await userService.getAllUsersWithEmailsData();

    const storedArticle = await articleService.getArticleEmail(articleId);

    let numberOfEmailedUser = 0;

    await Promise.all(
      users.map(
        async ({
          name,
          email,
          emailNotification,
          id: userId,
          articleEmails,
        }) => {
          const userGotArticleEmail = articleEmails?.some(
            (articleEmail) => articleEmail.articleId === articleId
          );

          if (emailNotification && !userGotArticleEmail) {
            await sendArticleMail({ name, email, articleId });
            try {
              await userService.addArticleEmailsToUserData({
                userId,
                articleEmailData: storedArticle,
              });

              numberOfEmailedUser = numberOfEmailedUser + 1;
            } catch (error) {
              throw catchErrorHandler({
                error,
                message:
                  "Ошибка в цикле при отправке и-мэйла всем пользователям",
              });
            }
          }
        }
      )
    );

    return numberOfEmailedUser;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при отправке и-мэйла всем пользователям",
    });
  }
};

export const sendArticleMail = async ({
  name,
  email,
  articleId,
}: {
  name: string;
  email: string;
  articleId: number;
}) => {
  const { title, summary, imageSourceId } = ARTICLES.find(
    (article) => article.id === articleId
  ) as Article;

  try {
    const { accepted, rejected, pending } = await transporter.sendMail({
      from: { address: SMTP_USER, name: BRAND_NAME_STRING },
      to: email,
      bcc: SMTP_USER,
      subject: "Новая интересная статья",
      html: getEmailHtml({
        name,
        extraMessage: summary,
        text: `Мы выпустили интересную статью для тебя - "${title}". Ты можешь прочесть ее полностью на сайте. Поверь, это будет очень полезно для тебя.`,
        emailPurpose: "NEWS",
        pageUrlForButton: `/article/${articleId}`,
        imageSourceUrl: imageSourceId
          ? formatGoogleDriveImageUrl(imageSourceId)
          : undefined,
      }),
    });

    return { accepted, rejected, pending };
  } catch (error: any) {
    throw catchErrorHandler({ error, message: "Ошибка при отправке и-мэйла" });
  }
};

export const sendNewConsultationEmailToAllUsers = async ({
  consultationId,
}: NewConsultationEmailBody) => {
  try {
    const user = await cookieService.getUserDataFromCookies();
    if (user.role !== "ADMIN") {
      throw ApiError.badRequest("У вас нет прав для отправки и-мэйла");
    }

    const users = await userService.getAllUsersWithEmailsData();

    const { consultation, consultationEmail } =
      await consultationService.getConsultationEmail(consultationId);

    let numberOfEmailedUser = 0;

    await Promise.all(
      users.map(
        async ({
          name,
          email,
          emailNotification,
          id: userId,
          consultationEmails,
        }) => {
          const userGotArticleEmail = consultationEmails?.some(
            (consultationEmail) =>
              consultationEmail.consultationId === consultationId
          );

          if (emailNotification && !userGotArticleEmail) {
            await sendConsultationEmail({
              name,
              email,
              consultation,
            });

            try {
              await userService.addConsultationEmailsToUserData({
                userId,
                consultationEmail,
              });

              numberOfEmailedUser = numberOfEmailedUser + 1;
            } catch (error) {
              throw catchErrorHandler({
                error,
                message:
                  "Ошибка в цикле при отправке и-мэйла всем пользователям",
              });
            }
          }
        }
      )
    );

    return numberOfEmailedUser;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при отправке и-мэйла всем пользователям",
    });
  }
};

export const sendConsultationEmail = async ({
  name,
  email,
  consultation,
}: {
  name: string;
  email: string;
  consultation: Consultation;
}) => {
  const { title, subTitle, imageSource, id } = consultation;

  try {
    const { accepted, rejected, pending } = await transporter.sendMail({
      from: { address: SMTP_USER, name: BRAND_NAME_STRING },
      to: email,
      bcc: SMTP_USER,
      subject: "Новый вид консультации",
      html: getEmailHtml({
        name,
        extraMessage: subTitle ? subTitle : undefined,
        text: `Мы выпустили новый вид консультации для тебя - "${title}". Ты можешь просмотреть ее полностью на сайте. Поверь, это будет очень полезно для тебя.`,
        emailPurpose: "NEWS",
        pageUrlForButton: `/consultation/${id}`,
        imageSourceUrl: imageSource
          ? formatGoogleDriveImageUrl(imageSource)
          : undefined,
      }),
    });

    return { accepted, rejected, pending };
  } catch (error: any) {
    throw catchErrorHandler({ error, message: "Ошибка при отправке и-мэйла" });
  }
};
