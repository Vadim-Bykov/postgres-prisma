import { User, UserCreationBody } from "@/models/users";
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
  tagTypes: ["Users", "Auth"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${String(url).replace("undefined", "")}/api/`,
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, { userId: string }>({
      query: ({ userId }) => `users/${userId}`,
    }),
    createUser: builder.mutation<User, UserCreationBody>({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users", "Auth"],
    }),
    removeUser: builder.mutation<User, { userId: number }>({
      query: ({ userId }) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Auth"],
    }),
    authentication: builder.query<{ isAuth: boolean }, void>({
      query: () => "auth",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useRemoveUserMutation,
  useAuthenticationQuery,
} = appApi;
