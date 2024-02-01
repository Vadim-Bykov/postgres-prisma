import { PurchaseBody } from "@/models/purchase";
import { Purchase } from "@prisma/client";
import { appApi } from "../appApi";

export const purchaseApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserPurchases: builder.query<Purchase[], void>({
      query: () => "purchase",
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation<Purchase, PurchaseBody>({
      query: (purchaseData) => ({
        url: "purchase",
        method: "POST",
        body: purchaseData,
      }),
      invalidatesTags: ["Purchase"],
    }),
  }),
});

export const { useGetAllUserPurchasesQuery, useCreatePurchaseMutation } =
  purchaseApi;
