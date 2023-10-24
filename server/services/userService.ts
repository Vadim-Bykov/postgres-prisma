import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { getUserDto } from "../dtos/userDto";
import * as tokenService from "./tokenService";

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
  const candidate = await prisma.users.findFirst({ where: { email } });

  if (candidate) {
    throw new Error(`User with email ${email} already exists`);
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
  const { accessToken, refreshToken } = tokenService.generateToken(userDto);
  await tokenService.saveRefreshToken(userDto.id, refreshToken);

  return { user: userDto, accessToken, refreshToken };
};
