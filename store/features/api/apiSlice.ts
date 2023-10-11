import { users } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = process.env.VERCEL_URL;

export interface Post {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
}

export const appApi = createApi({
  reducerPath: "api",
  tagTypes: ["Posts"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${String(url).replace("undefined", "")}/api/`,
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<users[], void>({
      query: () => "users",
      providesTags: ["Posts"],
    }),
  }),
});

export const { useGetUsersQuery } = appApi;
