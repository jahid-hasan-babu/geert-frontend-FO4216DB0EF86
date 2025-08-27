import { baseApi } from "../../api/baseApi";

const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMicroLearning: builder.mutation({
      query: (data) => {
        return {
          url: "/courses/create-course",
          method: "POST",
          body: data?.formData,
        };
      },
      invalidatesTags: ["courses"],
    }),
  }),
});

export const { useAddMicroLearningMutation } = coursesApi;
