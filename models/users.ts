import { Users } from "@prisma/client";

export interface User extends Users {}

export interface UserCreationBody {
  email: User["email"];
  name: User["name"];
  imageFormData?: FormData;
}
