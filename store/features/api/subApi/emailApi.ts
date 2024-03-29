import { ArticleEmailBody, NewConsultationEmailBody } from "@/models/email";
import { appApi } from "../appApi";

export const emailApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    sendArticleEmail: builder.mutation<{ message: string }, ArticleEmailBody>({
      query: (body) => ({
        url: "email/article",
        method: "POST",
        body,
      }),
    }),
    sendConsultationEmail: builder.mutation<
      { message: string },
      NewConsultationEmailBody
    >({
      query: (body) => ({
        url: "email/consultation",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendArticleEmailMutation, useSendConsultationEmailMutation } =
  emailApi;
