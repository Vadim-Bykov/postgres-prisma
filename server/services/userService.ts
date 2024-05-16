import prisma from "@/lib/prisma";
import {
  UpdateUserPersonalDataBody,
  UserCreationBody,
  UserLoginBody,
} from "@/models/users";
import * as cookieService from "@/server/services/cookieService";
import { catchErrorHandler } from "@/utils/errorHandler";
import { ArticleEmail, ConsultationEmail } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { getUserDto } from "../dtos/userDto";
import { ApiError } from "../error/ApiError";
import { getEnvironment } from "../helpers/envKeys";
import * as mailService from "./mailService";
import * as tokenService from "./tokenService";
import * as walletService from "./walletService";
import * as friendService from "./friendService";

// interface IRegistrationBody {
//   name: string;
//   email: string;
//   password: string;
//   picture?: any;
//   // picture?: fileUpload.UploadedFile;
// }

export const registration = async ({
  name,
  email,
  password,
  location,
  imageFormData,
  invitedByFriendEmail,
}: // picture,
UserCreationBody) => {
  try {
    const candidate = await prisma.users.findUnique({ where: { email } });

    if (candidate) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${email} уже зарегистрирован в базе`
      );
    }

    const friend =
      invitedByFriendEmail &&
      (await prisma.users.findUnique({
        where: { email: invitedByFriendEmail },
      }));

    if (invitedByFriendEmail && !friend) {
      throw ApiError.badRequest(
        `Пользователь (ваш друг) с адресом эл.почты ${invitedByFriendEmail} не зарегистрирован в базе. Пожалуйста уточните адрес эл.почты у своего друга.`
      );
    }

    // const activationLink = v4();
    const hashPassword = await bcrypt.hash(password, 3);
    //   const fileName = saveFile(picture);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashPassword,
        role:
          email === "bvntaev@gmail.com" ||
          email === "ttatsianabbykava1983@gmail.com"
            ? "ADMIN"
            : "USER",
        environment: getEnvironment(),
        //  activationLink,
        //  picture: fileName,
        name,
        invitedByFriendEmail,
      },
    });

    Promise.all([
      await walletService.createWallet({
        userId: user.id,
        invitedByFriend: !!invitedByFriendEmail,
      }),
      await prisma.location.create({
        data: { ...location, userId: user.id },
      }),
      !!invitedByFriendEmail &&
        (await friendService.createFriend({
          invitedByFriendEmail,
          userId: user.id,
        })),
      // await mailService.sendActivationMail({ name, email });
    ]);

    const userDto = getUserDto({ ...user, location });
    const { refreshToken } = await tokenService.generateToken(userDto);
    await tokenService.saveRefreshToken({ userId: userDto.id, refreshToken });

    return { user: userDto, refreshToken };
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при регистрации пользователя в базе",
    });
  }
};

export const login = async ({ email, password }: UserLoginBody) => {
  try {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${email} не зарегистрирован в базе`
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw ApiError.badRequest("Неверный пароль");
    }

    const location = await prisma.location.findUnique({
      where: { userId: user.id },
    });
    const userDto = getUserDto({ ...user, location });

    const { refreshToken } = await tokenService.generateToken(userDto);
    await tokenService.saveRefreshToken({ userId: userDto.id, refreshToken });

    return { user: userDto, refreshToken };
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при входе в аккаунт пользователя",
    });
  }
};

export const logout = async (refreshToken: string) => {
  try {
    const tokenData = await tokenService.removeRefreshToken(refreshToken);

    return tokenData;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при выходе из аккаунта пользователя",
    });
  }
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.users.findMany();

    return users.map((user) => getUserDto(user));
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при получении данных пользователей из базы.",
    });
  }
};

export const getAllUsersWithEmailsData = async () => {
  try {
    const users = await prisma.users.findMany({
      include: { articleEmails: true, consultationEmails: true },
    });

    return users;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при получении данных пользователей из базы.",
    });
  }
};

export const getUser = async (userId: number) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { location: true },
    });

    return user;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при получении данных пользователя из базы",
    });
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const user = await prisma.users.delete({ where: { id: +userId } });
    const userDto = getUserDto(user);

    return userDto;
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при удалении пользователя в базе",
    });
  }
};

export const getResetPasswordLink = async (email: string) => {
  try {
    const resetPasswordLink = v4();
    let linkData = null;

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${email} не зарегистрирован в базе`
      );
    }

    const previousLinkData = await prisma.passwordResetLink.findUnique({
      where: { userId: user.id },
    });

    if (previousLinkData) {
      linkData = await prisma.passwordResetLink.update({
        where: { userId: user.id },
        data: {
          link: resetPasswordLink,
          state: "REQUESTED",
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      linkData = await prisma.passwordResetLink.create({
        data: { userId: user.id, link: resetPasswordLink, state: "REQUESTED" },
      });
    }

    await mailService.sendResetPasswordLinkMail({
      name: user.name,
      email,
      link: resetPasswordLink,
    });

    return { link: linkData.link };
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при получении ссылки для сброса пароля",
    });
  }
};

export const resetUserPassword = async (link: string) => {
  try {
    const resetLinkData = await prisma.passwordResetLink.findFirst({
      where: { link },
    });

    if (!resetLinkData) {
      throw ApiError.badRequest("Не корректная ссылка");
    }

    if (resetLinkData.state === "USED") {
      throw ApiError.badRequest("Пароль уже был сброшен ранее");
    }

    const hashPassword = await bcrypt.hash(
      process.env.VERCEL_DEFAULT_RESET_PASSWORD!,
      3
    );

    await prisma.users.update({
      where: { id: resetLinkData.userId },
      data: { password: hashPassword },
    });

    await prisma.passwordResetLink.update({
      where: { userId: resetLinkData.userId },
      data: { state: "USED", updatedAt: new Date().toISOString() },
    });

    const { numberOfRemovedTokens } = await tokenService.removeAllRefreshToken(
      resetLinkData.userId
    );

    return { numberOfRemovedTokens };
  } catch (error) {
    throw catchErrorHandler({
      error,
      message: "Ошибка в базе при сбросе пароля пользователя",
    });
  }
};

export const updateUserPersonalData = async ({
  email,
  name,
  password,
  newPassword,
  emailNotification,
}: UpdateUserPersonalDataBody) => {
  try {
    if ((email || newPassword) && !password) {
      throw ApiError.badRequest(`Введите пожалуйста пароль`);
    }
    const userData = await cookieService.getUserDataFromCookies();
    const [user, candidate] = await Promise.all([
      prisma.users.findUnique({ where: { id: userData.id } }),
      email && prisma.users.findUnique({ where: { email } }),
    ]);

    if (!user) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${email} не зарегистрирован в базе`
      );
    }

    if (candidate) {
      throw ApiError.badRequest(
        `Пользователь с адресом эл.почты ${email} уже зарегистрирован в базе`
      );
    }

    let hashPassword;

    if (password && newPassword) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw ApiError.badRequest("Неверный старый пароль");
      }
      hashPassword = await bcrypt.hash(newPassword, 3);
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        email,
        name,
        password: hashPassword,
        emailNotification,
        updatedAt: new Date().toISOString(),
      },
    });

    if ((email || newPassword) && updatedUser) {
      await tokenService.removeAllRefreshToken(updatedUser.id);
    }

    const userDto = getUserDto({ ...updatedUser, location: userData.location });

    const oldRefreshToken = cookieService.getTokensFromCookies();
    const { refreshToken } = await tokenService.generateToken(userDto);
    await tokenService.updateRefreshToken({
      userId: userDto.id,
      newRefreshToken: refreshToken,
      oldRefreshToken,
    });

    return { user: userDto, refreshToken };
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при обновлении данных пользователя в базе",
    });
  }
};

export const updateUserLastVisit = async (userId: number) => {
  try {
    await prisma.users.update({
      where: { id: userId },
      data: { lastVisitAt: new Date().toISOString() },
    });

    return;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: "Ошибка при обновлении даты последнего визита пользователя",
    });
  }
};

export const addArticleEmailsToUserData = async ({
  userId,
  articleEmailData,
}: {
  userId: number;
  articleEmailData: ArticleEmail;
}) => {
  const { id, articleId, createdAt, title } = articleEmailData;

  try {
    await prisma.users.update({
      where: { id: userId },
      data: { articleEmails: { connect: { id, articleId, createdAt, title } } },
    });

    return;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: `Ошибка при обновлении данных об отосланных и-мэйлах у пользователя с ID: ${userId}`,
    });
  }
};

export const addConsultationEmailsToUserData = async ({
  userId,
  consultationEmail,
}: {
  userId: number;
  consultationEmail: ConsultationEmail;
}) => {
  try {
    await prisma.users.update({
      where: { id: userId },
      data: {
        consultationEmails: {
          connect: consultationEmail,
        },
      },
    });

    return;
  } catch (error: any) {
    throw catchErrorHandler({
      error,
      message: `Ошибка при обновлении данных об отосланных и-мэйлах у пользователя с ID: ${userId}`,
    });
  }
};
