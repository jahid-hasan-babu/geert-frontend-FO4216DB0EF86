import { baseApi } from "../../api/baseApi";

const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMicroLearning: builder.mutation({
      query: (data) => ({
        url: "/courses/create-course",
        method: "POST",
        body: data?.formData,
      }),
      invalidatesTags: ["courses"],
    }),
     getAllCourses: builder.query({
      query: () => ({
        url: "/courses/all-course",
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    getMyCourses: builder.query({
      query: (status) => ({
        url: "/courses/my-course",
        method: "GET",
        params: { status },
      }),
      providesTags: ["courses"],
    }),
  }),
});

export const { useAddMicroLearningMutation,useGetAllCoursesQuery,useGetMyCoursesQuery } = coursesApi;
