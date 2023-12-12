import { UserDto } from "@/server/dtos/userDto";
import { appApi } from "../appApi";
import { User, UserCreationBody, UserLoginBody } from "@/models/users";

export const userApi = appApi.injectEndpoints({
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
    removeUser: builder.mutation<UserDto, { userId: number }>({
      query: ({ userId }) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Auth"],
    }),
    authentication: builder.query<
      {
        user?: UserDto;
        auth: boolean;
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
} = userApi;
