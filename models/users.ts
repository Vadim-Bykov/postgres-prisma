import { Users } from "@prisma/client";
import { UserLocation } from "./location";

export interface User extends Users {}

export interface UserCreationBody {
  name: User["name"];
  email: User["email"];
  password: User["password"];
  imageFormData?: FormData;
  location?: UserLocation;
  invitedByFriendEmail?: User["invitedByFriendEmail"];
}

export interface UserLoginBody {
  email: User["email"];
  password: User["password"];
}

export interface UpdateUserPersonalDataBody {
  name?: User["name"];
  email?: User["email"];
  password?: User["password"];
  newPassword?: User["password"];
  emailNotification?: User["emailNotification"];
}
