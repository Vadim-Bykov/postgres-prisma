import { PurchaseBody } from "@/models/purchase";
import { Purchase } from "@prisma/client";
import { appApi } from "../appApi";

export const purchaseApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserPurchases: builder.query<Purchase[], void>({
      query: () => "purchase",
      providesTags: ["Purchase"],
    }),
    getUserPurchase: builder.query<Purchase, { consultationId: string }>({
      query: ({ consultationId }) => `purchase/${consultationId}`,
      providesTags: ["Purchase"],
    }),
    createPurchase: builder.mutation<Purchase, PurchaseBody>({
      query: (purchaseData) => ({
        url: "purchase",
        method: "POST",
        body: purchaseData,
      }),
    }),
    updatePurchase: builder.mutation<Purchase, PurchaseBody>({
      query: (purchaseData) => ({
        url: "purchase",
        method: "PATCH",
        body: purchaseData,
      }),
    }),
  }),
});

export const {
  useGetAllUserPurchasesQuery,
  useCreatePurchaseMutation,
  useGetUserPurchaseQuery,
  useUpdatePurchaseMutation,
} = purchaseApi;
