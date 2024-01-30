import { Banking } from "@prisma/client";
import { appApi } from "../appApi";

export const bankingApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    bankingData: builder.query<Banking[], void>({
      query: () => "banking",
    }),
  }),
});

export const { useBankingDataQuery } = bankingApi;
