import { UserLocation } from "@/models/location";
import { User } from "@/models/users";
import { Friend, Role } from "@prisma/client";

export interface FriendDto {
  id: Friend["id"];
  invitedByFriendEmail: Friend["invitedByFriendEmail"];
  friendData: { id: User["id"]; name: User["name"]; email: User["email"] };
}

interface FriendDtoSource extends Friend {
  users: User;
}

type GetFriendDto = (friendData: FriendDtoSource) => FriendDto;

export const getFriendDto: GetFriendDto = ({
  id,
  invitedByFriendEmail,
  users: { id: friendId, email, name },
}) => {
  return {
    id,
    invitedByFriendEmail,
    friendData: { id: friendId, email, name },
  };
};
