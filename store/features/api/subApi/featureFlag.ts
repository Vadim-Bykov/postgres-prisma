import { appApi } from "../appApi";
import { FeatureFlag } from "@prisma/client";

export const featureFlagApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatureFlags: builder.query<FeatureFlag[], void>({
      query: () => "feature-flag",
      providesTags: ["FeatureFlag"],
    }),
  }),
});

export const { useGetFeatureFlagsQuery } = featureFlagApi;
