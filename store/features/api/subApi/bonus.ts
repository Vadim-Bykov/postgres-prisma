import { BonusesFromFriend } from "@/models/bonus";
import { appApi } from "../appApi";
import { Bonus } from "@prisma/client";

export const bonusApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getBonusesFromFriend: builder.query<
      BonusesFromFriend[],
      { friendObjectId: number }
    >({
      query: (params) => ({ url: "bonus", params }),
    }),
    getUserBonuses: builder.query<Bonus[], void>({
      query: () => "bonus",
      providesTags: ["Bonus"],
    }),
  }),
});

export const { useGetBonusesFromFriendQuery, useGetUserBonusesQuery } =
  bonusApi;
