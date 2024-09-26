import { FriendDto } from "@/server/dtos/friendDto";
import { appApi } from "../appApi";

export const friendApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    friends: builder.query<FriendDto[], void>({
      query: () => "friend",
    }),
  }),
});

export const { useFriendsQuery } = friendApi;
