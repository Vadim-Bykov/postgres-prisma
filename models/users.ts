import { Users } from "@prisma/client";

export interface User extends Users {}

export interface UserCreationBody {
  name: User["name"];
  email: User["email"];
  password: User["password"];
  imageFormData?: FormData;
}

export interface UserLoginBody {
  email: User["email"];
  password: User["password"];
}
