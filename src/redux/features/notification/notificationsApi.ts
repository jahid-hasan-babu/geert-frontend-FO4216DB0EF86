import { baseApi } from "../../api/baseApi";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNotification: builder.mutation({
      query: (notificationData) => ({
        url: "/notifications/send-notifications",
        method: "POST",
        body: notificationData,
      }),
      invalidatesTags: ["notification"],
    }),

    deleteNotification: builder.mutation({
      query: (notificationId: string) => ({
        url: `/notifications/delete-notification/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} = notificationsApi;
