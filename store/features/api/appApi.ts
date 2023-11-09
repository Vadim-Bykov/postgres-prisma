import { Location } from "@/models/location";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = process.env.VERCEL_URL;

export const appApi = createApi({
  reducerPath: "api",
  tagTypes: ["Users", "Auth"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${String(url).replace("undefined", "")}/api/`,
  }),
  endpoints: (builder) => ({
    getLocation: builder.query<Location, void>({
      query: () => "https://ipapi.co/json/",
    }),
  }),
});

export const { useGetLocationQuery } = appApi;
