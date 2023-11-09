import { logout } from "./../../../server/services/userService";
import { User, UserCreationBody, UserLoginBody } from "@/models/users";
import { UserDto } from "@/server/dtos/userDto";
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
    getUsers: builder.query<UserDto[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getUser: builder.query<UserDto, { userId: string }>({
      query: ({ userId }) => `users/${userId}`,
    }),
    createUser: builder.mutation<UserDto, UserCreationBody>({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users", "Auth"],
    }),
    login: builder.mutation<UserDto, UserLoginBody>({
      query: ({ email, password }) => ({
        url: "users/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "users/logout",
        method: "PUT",
      }),
      invalidatesTags: ["Auth"],
    }),
    removeUser: builder.mutation<User, { userId: number }>({
      query: ({ userId }) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Auth"],
    }),
    authentication: builder.query<
      {
        user: UserDto;
        auth: true;
      },
      void
    >({
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
  useLoginMutation,
  useLogoutMutation,
} = appApi;
