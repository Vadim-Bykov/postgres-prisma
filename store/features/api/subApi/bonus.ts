import { BonusesFromFriend } from "@/models/bonus";
import { appApi } from "../appApi";

export const bonusApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getBonusesFromFriend: builder.query<
      BonusesFromFriend[],
      { friendObjectId: number }
    >({
      query: (params) => ({ url: "bonus", params }),
    }),
  }),
});

export const { useGetBonusesFromFriendQuery } = bonusApi;
