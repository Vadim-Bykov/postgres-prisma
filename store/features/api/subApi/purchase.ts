import { PurchaseBody, UserPurchase } from "@/models/purchase";
import { Purchase } from "@prisma/client";
import { appApi } from "../appApi";

export const purchaseApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserPurchases: builder.query<UserPurchase[], void>({
      query: () => "purchase",
      providesTags: ["Purchase"],
    }),
    getUserPurchase: builder.query<UserPurchase, { consultationId: string }>({
      query: ({ consultationId }) => `purchase/${consultationId}`,
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation<Purchase, PurchaseBody>({
      query: (purchaseData) => ({
        url: "purchase",
        method: "POST",
        body: purchaseData,
      }),
      invalidatesTags: ["Wallet"],
    }),
    updatePurchase: builder.mutation<Purchase, PurchaseBody>({
      query: (purchaseData) => ({
        url: "purchase",
        method: "PATCH",
        body: purchaseData,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetAllUserPurchasesQuery,
  useCreatePurchaseMutation,
  useGetUserPurchaseQuery,
  useUpdatePurchaseMutation,
} = purchaseApi;
