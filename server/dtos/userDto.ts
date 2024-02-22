import { UserLocation } from "@/models/location";
import { User } from "@/models/users";
import { Role } from "@prisma/client";

export interface UserDto {
  id: User["id"];
  email: string;
  picture?: string;
  name: string;
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
}) => {
  return {
    id,
    email,
    role,
    name,
    emailNotification,
    location: location
      ? {
          city: location.city,
          country: location.country,
          country_name: location.country_name,
        }
      : undefined,
  };
};
