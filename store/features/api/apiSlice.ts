import { users } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const IS_DEV = process.env.VERCEL_ENV === "development";
const url = !IS_DEV ? "http://localhost:3000" : process.env.POSTGRES_HOST;

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
    baseUrl: `${url}/api/`,
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<users[], void>({
      query: () => "users",
      providesTags: ["Posts"],
    }),
  }),
});

export const { useGetUsersQuery } = appApi;
