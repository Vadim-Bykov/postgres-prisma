import { UserDto } from "@/server/dtos/userDto";
import { appApi } from "../appApi";
import { User, UserCreationBody, UserLoginBody } from "@/models/users";
import { Consultation } from "@prisma/client";

export const consultationApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConsultations: builder.query<Consultation[], void>({
      query: () => "consultation",
      providesTags: ["Consultation"],
    }),
    getConsultation: builder.query<Consultation, { id: string }>({
      query: ({ id }) => `consultation/${id}`,
    }),
    // deprecateConsultation: builder.mutation<Consultation, { id: number }>({
    //   query: ({ id }) => ({
    //     url: `consultation/${id}`,
    //     method: "PATH",
    //   }),
    //   invalidatesTags: ["Consultation"],
    // }),
  }),
});

export const { useGetAllConsultationsQuery, useGetConsultationQuery } =
  consultationApi;
