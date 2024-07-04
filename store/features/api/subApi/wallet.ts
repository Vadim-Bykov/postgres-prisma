import { Wallet } from "@prisma/client";
import { appApi } from "../appApi";

export const walletApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    wallet: builder.query<Wallet, void>({
      query: () => "wallet",
      providesTags: ["Wallet"],
    }),
  }),
});

export const { useWalletQuery } = walletApi;
