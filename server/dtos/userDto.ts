import { UserLocation } from "@/models/location";
import { User } from "@/models/users";
import { Role } from "@prisma/client";

export interface UserDto {
  id: User["id"];
  email: string;
  picture?: string;
  roles?: Role;
  name?: string;
  createdAt: User["createdAt"];
  location?: UserLocation;
}

interface UserDtoSource extends User {
  location?: UserLocation;
}

type GetUserDto = (userData: UserDtoSource) => UserDto;

export const getUserDto: GetUserDto = ({
  id,
  email,
  createdAt,
  role = "USER",
  name,
  location,
}) => {
  return {
    id,
    email,
    role,
    name,
    createdAt,
    location: location && {
      city: location.city,
      country: location.country,
      country_name: location.country_name,
    },
  };
};
