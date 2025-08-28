import { baseApi } from "../../api/baseApi";

const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (filter) => {
        return {
          url: "/users/all-users",
          method: "GET",
          params: filter,
        };
      },
      providesTags: ["user"],
    }),
    getCoursesCategory: builder.query({
      query: () => ({
        url: "/category/all-category",
        method: "GET",
      }),
      providesTags: ["category"],
    }),
  }),
});

export const { useGetUserQuery, useGetCoursesCategoryQuery } = exampleApi;
