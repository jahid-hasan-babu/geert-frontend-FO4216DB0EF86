import { baseApi } from "../../api/baseApi";

const exampleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (filter) => ({
        url: "/users/all-users",
        method: "GET",
        params: filter,
      }),
      providesTags: ["user"],
    }),

    getCoursesCategory: builder.query({
      query: () => ({
        url: "/category/all-category",
        method: "GET",
      }),
      providesTags: ["category"],
    }),

    addCourseCategory: builder.mutation({
      query: (name) => ({
        url: "/category/create-category",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["category"],
    }),

    editCourseCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/category/update-category/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["category"],
    }),

    deleteCourseCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetCoursesCategoryQuery,
  useAddCourseCategoryMutation,
  useEditCourseCategoryMutation,
  useDeleteCourseCategoryMutation,
} = exampleApi;
