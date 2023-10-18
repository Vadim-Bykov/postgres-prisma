import { User } from "@/models/users";
import { Role } from "@prisma/client";

export interface UserDto {
  id: User["id"];
  email: string;
  picture?: string;
  roles?: Role;
  name?: string;
}

type GetUserDto = (userData: User) => UserDto;

export const getUserDto: GetUserDto = ({ id, email, role = "USER", name }) => {
  return {
    id,
    email,
    role,
    name,
  };
};
