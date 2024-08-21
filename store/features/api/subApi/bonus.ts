import { BonusesFromFriend, ViewedBonusBody } from "@/models/bonus";
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
    markViewedBonus: builder.mutation<void, ViewedBonusBody>({
      query: (bonusData) => ({
        url: "bonus",
        body: bonusData,
        method: "PATCH",
      }),
      invalidatesTags: ["Bonus"],
    }),
  }),
});

export const {
  useGetBonusesFromFriendQuery,
  useGetUserBonusesQuery,
  useMarkViewedBonusMutation,
} = bonusApi;
