import { ArticleEmailBody } from "@/models/email";
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
  }),
});

export const { useSendArticleEmailMutation } = emailApi;
