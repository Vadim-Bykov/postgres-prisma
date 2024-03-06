import nodemailer from "nodemailer";
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

const transporter = nodemailer.createTransport({
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
            ? " на тему " + consultation.subTitle || consultation.title
            : ""
        }.`
      : `Рады, что Вы обратились к нам за консультацией${
          consultation
            ? " на тему " + consultation.subTitle || consultation.title
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
    throw ApiError.badRequest("Sending email error", error);
  }
};
