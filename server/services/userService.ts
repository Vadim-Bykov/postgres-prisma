import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { getUserDto } from "../dtos/userDto";
import * as tokenService from "./tokenService";
import { ApiError } from "../error/ApiError";
import { UserCreationBody, UserLoginBody } from "@/models/users";
import { NextResponse } from "next/server";
import { getEnvironment } from "../helpers/envKeys";

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
}: // picture,
UserCreationBody) => {
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
        role: email === "bvntaev@gmail.com" ? "ADMIN" : "USER",
        environment: getEnvironment(),
        //  activationLink,
        //  picture: fileName,
        name,
      },
    });

    await prisma.location.create({
      data: { ...location, userId: user.id },
    });

    const userDto = getUserDto({ ...user, location });
    const { refreshToken } = await tokenService.generateToken(userDto);
    await tokenService.saveRefreshToken({ userId: userDto.id, refreshToken });

    return { user: userDto, refreshToken };
  } catch (error: any) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest("Registration error", error);
    }
  }
};

export const login = async ({ email, password }: UserLoginBody) => {
  try {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      throw ApiError.badRequest(`User with email ${email} doesn't exist`);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw ApiError.badRequest("Password is invalid");
    }

    const location = await prisma.location.findUnique({
      where: { userId: user.id },
    });
    const userDto = getUserDto({ ...user, location });

    const { refreshToken } = await tokenService.generateToken(userDto);
    await tokenService.saveRefreshToken({ userId: userDto.id, refreshToken });

    return { user: userDto, refreshToken };
  } catch (error) {
    if (error instanceof NextResponse) {
      throw error;
    } else {
      throw ApiError.badRequest("Login error", error);
    }
  }
};

export const logout = async (refreshToken: string) => {
  try {
    const tokenData = await tokenService.removeRefreshToken(refreshToken);

    return tokenData;
  } catch (error: any) {
    if (error instanceof NextResponse) {
      return error;
    } else {
      throw ApiError.badRequest("Logout error", error);
    }
  }
};

export const getAllUsers = async () => {
  try {
    const users = await prisma.users.findMany();

    return users.map((user) => getUserDto(user));
  } catch (error) {
    throw ApiError.badRequest("getAllUsers error", error);
  }
};

export const getUser = async (userId: number) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });

    return user;
  } catch (error) {
    throw ApiError.badRequest("Get User error", error);
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const user = await prisma.users.delete({ where: { id: +userId } });
    const userDto = getUserDto(user);

    return userDto;
  } catch (error) {
    throw ApiError.badRequest("Remove User error", error);
  }
};
