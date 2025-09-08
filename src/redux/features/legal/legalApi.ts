// services/legalApi.ts
import { baseApi } from "@/redux/api/baseApi";

export const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeData: builder.query({
      query: () => ({ url: "/legal/get-home-data", method: "GET" }),
      transformResponse: (response) => response.data[0],
      providesTags: ["example"],
    }),
    postHomeData: builder.mutation({
      query: (body) => ({ url: "/legal/home", method: "POST", body }),
      invalidatesTags: ["example"],
    }),

    getLegalData: builder.query({
      query: () => ({ url: "/legal/get-legal", method: "GET" }),
      transformResponse: (response) => response.data[0],
      providesTags: ["example"],
    }),
    postLegalData: builder.mutation({
      query: (body) => ({ url: "/legal/add-legal", method: "POST", body }),
      invalidatesTags: ["example"],
    }),
    getHelpSupport: builder.query({
      query: () => ({
        url: "/legal/help-support",
        method: "GET",
      }),
      providesTags: ["example"],
    }),

    createHelpSupport: builder.mutation({
      query: (data) => ({
        url: "/legal/create-help-support",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["example"],
    }),
  }),
});

export const {
  useGetHomeDataQuery,
  usePostHomeDataMutation,
  useGetLegalDataQuery,
  usePostLegalDataMutation,
  useGetHelpSupportQuery,
  useCreateHelpSupportMutation,
} = legalApi;
