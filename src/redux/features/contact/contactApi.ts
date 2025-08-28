import { baseApi } from "../../api/baseApi";

const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactForm: builder.mutation({
      query: (formData) => ({
        url: "/contact",
        method: "POST",
        body: formData,
      }),
    }),
  }),
})

export const { useSendContactFormMutation } = coursesApi
