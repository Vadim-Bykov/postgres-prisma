import { Friend, Wallet } from "@prisma/client";
import { appApi } from "../appApi";

export const friendApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    friends: builder.query<Friend[], void>({
      query: () => "friend",
    }),
  }),
});

export const { useFriendsQuery } = friendApi;
