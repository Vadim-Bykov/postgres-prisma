import { users } from "@prisma/client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "process";

const IS_DEV = env.NODE_ENV === "development";
const url = !IS_DEV ? "http://localhost:3000" : env.VERCEL_URL;

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
