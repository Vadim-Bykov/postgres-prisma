import nodemailer from "nodemailer";
import { getRegistrationEmailHtml } from "../helpers/email/registrationEmail";
import { getPurchaseEmailHtml } from "../helpers/email/purchaseEmail";
import * as consultationService from "./consultationService";
import { ApiError } from "../error/ApiError";
import { BRAND_NAME_STRING } from "@/app/constants/brand";

const SMTP_HOST = process.env.VERCEL_SMTP_HOST!;
const SMTP_PORT = Number(process.env.VERCEL_SMTP_PORT)!;
const SMTP_USER = process.env.VERCEL_SMTP_USER!;
const SMTP_PASSWORD = process.env.VERCEL_SMTP_PASSWORD;
const API_URL = process.env.VERCEL_URL!;

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
    html: getRegistrationEmailHtml({ name }),
  });
};

export const sendResetPasswordLinkMail = async ({
  link,
  email,
}: {
  link: string;
  email: string;
}) => {
  const urlLink = `${API_URL}/reset-password/${link}`;

  await transporter.sendMail({
    from: { address: SMTP_USER, name: "АСТРО" },
    to: email,
    bcc: SMTP_USER,
    subject: "Reset password link",
    html: `
         <div>
            <h1>Hello ${email}!</h1>
            <h3>You've requested to reset your password for ${email}!</h3>
            <h2>To reset the password click the link: ${urlLink}</h2>
            <h2>If you haven't requested to reset the password, do not click the link</h2>
            <h2>After resetting, your password will be ${process.env
              .VERCEL_DEFAULT_RESET_PASSWORD!}</h2>
            <h2>You will be able to update this on your account page</h2>
         </div>
       `,
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

    await transporter.sendMail({
      from: { address: SMTP_USER, name: "АСТРО" },
      to: email,
      bcc: SMTP_USER,
      subject: "Проверка оплаты консультации",
      html: getPurchaseEmailHtml({
        name,
        consultation: consultation?.title,
        isProvidedDataUpdate,
      }),
    });
  } catch (error: any) {
    throw ApiError.badRequest("Sending email error", error);
  }
};
