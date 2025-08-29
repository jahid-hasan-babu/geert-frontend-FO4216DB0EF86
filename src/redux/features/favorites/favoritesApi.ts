import { baseApi } from "../../api/baseApi";

const notificationsApi = baseApi.injectEndpoints({

    endpoints: (builder) => ({
        addToFavorites: builder.mutation({
            query: (courseId) => ({
                url: "/favorites",
                method: "POST",
                body: { courseId },
            }),
        }),
       
    }),
  });

export const { useAddToFavoritesMutation } = notificationsApi;