import { ApiLocationResponse, UserLocation } from "@/models/location";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = process.env.VERCEL_URL;

export type TagType =
  | "Users"
  | "Auth"
  | "Consultation"
  | "Purchase"
  | "Wallet"
  | "Bonus"
  | "FeatureFlag";

export const appApi = createApi({
  reducerPath: "api",
  tagTypes: [
    "Users",
    "Auth",
    "Consultation",
    "Purchase",
    "Wallet",
    "Bonus",
    "FeatureFlag",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${String(url).replace("undefined", "")}/api/`,
  }),
  endpoints: (builder) => ({
    getLocation: builder.query<UserLocation, void>({
      query: () => "https://ipapi.co/json/",
      transformResponse: ({
        country,
        city,
        country_name,
      }: ApiLocationResponse): UserLocation => ({
        country,
        city,
        country_name,
      }),
    }),
  }),
});

export const { useGetLocationQuery } = appApi;
