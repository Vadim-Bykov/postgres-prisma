import nodemailer from "nodemailer";

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
    from: { address: SMTP_USER, name: "PRO IT SCHOOL" },
    to: email,
    bcc: SMTP_USER,
    subject: "Registration on PRO IT SCHOOL",
    // subject: `Activate your account on ${API_URL}`,
    html: `
         <div>
            <h1>Hello ${name}!</h1>
            <h3>You've registered with email: ${email}!</h3>
            <h3>We are happy to see you!</h3>
         </div>
       `,
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
  // <a href="${urlLink}" >${urlLink}</a>

  await transporter.sendMail({
    from: { address: SMTP_USER, name: "PRO IT SCHOOL" },
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
