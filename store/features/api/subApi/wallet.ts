import { Wallet } from "@prisma/client";
import { appApi, TagType } from "../appApi";
import { useIsLoggedIn } from "@/utils/authorization";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryDefinition,
} from "@reduxjs/toolkit/query";

export const walletApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    wallet: builder.query<Wallet, void>({
      query: () => "wallet",
      providesTags: ["Wallet"],
    }),
  }),
});

const { useWalletQuery: useWalletQueryHook } = walletApi;

export const useWalletQuery: UseQuery<
  QueryDefinition<
    void,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      {},
      FetchBaseQueryMeta
    >,
    TagType,
    Wallet,
    "api"
  >
> = () => {
  const isLoggedIn = useIsLoggedIn();
  return useWalletQueryHook(undefined, { skip: !isLoggedIn });
};
