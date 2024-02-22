import { UserLocation } from "@/models/location";
import { User } from "@/models/users";
import { Role } from "@prisma/client";

export interface UserDto {
  id: User["id"];
  email: string;
  picture?: string;
  role?: Role;
  name: string;
  createdAt: User["createdAt"];
  emailNotification: User["emailNotification"];
  location?: UserLocation;
}

interface UserDtoSource extends User {
  location?: UserLocation | null;
}

type GetUserDto = (userData: UserDtoSource) => UserDto;

export const getUserDto: GetUserDto = ({
  id,
  email,
  role = "USER",
  name,
  location,
  emailNotification,
  createdAt,
}) => {
  return {
    id,
    email,
    role,
    name,
    emailNotification,
    createdAt,
    location: location
      ? {
          city: location.city,
          country: location.country,
          country_name: location.country_name,
        }
      : undefined,
  };
};
