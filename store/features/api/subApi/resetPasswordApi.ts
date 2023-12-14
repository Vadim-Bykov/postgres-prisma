import { User } from "@/models/users";
import { UserDto } from "@/server/dtos/userDto";
import { appApi } from "../appApi";

export const resetPasswordApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation<void, { email: User["email"] }>({
      query: (body) => ({
        url: "reset-password",
        method: "PATCH",
        body,
      }),
    }),
    resetPasswordLink: builder.query<UserDto, { link: string }>({
      query: ({ link }) => `reset-password/${link}`,
    }),
  }),
});

export const { useResetPasswordMutation, useResetPasswordLinkQuery } =
  resetPasswordApi;
