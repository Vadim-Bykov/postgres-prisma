import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { getUserDto } from "../dtos/userDto";
import * as tokenService from "./tokenService";
import { ApiError } from "../error/ApiError";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  picture?: any;
  // picture?: fileUpload.UploadedFile;
}

export const registration = async ({
  name,
  email,
  password,
  picture,
}: IRegistrationBody) => {
  try {
    const candidate = await prisma.users.findFirst({ where: { email } });

    if (candidate) {
      throw ApiError.badRequest(`User with email ${email} already exists`);
    }

    //   const activationLink = v4();
    const hashPassword = await bcrypt.hash(password, 3);
    //   const fileName = saveFile(picture);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashPassword,
        //  activationLink,
        //  picture: fileName,
        name,
      },
    });

    const userDto = getUserDto(user);
    const { refreshToken } = await tokenService.generateToken(userDto);
    await tokenService.saveRefreshToken({ userId: userDto.id, refreshToken });

    return { user: userDto, refreshToken };
  } catch (error: any) {
    throw ApiError.badRequest("Registration error", error);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.users.findMany();

    return users;
  } catch (error) {
    throw ApiError.badRequest("getAllUsers error", error);
  }
};

export const getUser = async (userId: number) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });

    return user;
  } catch (error) {
    throw ApiError.badRequest("getUser error", error);
  }
};
