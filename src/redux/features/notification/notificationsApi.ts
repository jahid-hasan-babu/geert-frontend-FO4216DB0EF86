import { baseApi } from "../../api/baseApi";

const notificationsApi = baseApi.injectEndpoints({

    endpoints: (builder) => ({
       createNotification: builder.mutation({
           query: (notificationData) => {
               return {
                   url: "/notifications/send-notifications",
                   method: "POST",
                   body: notificationData,
               };
           },
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
})

export const { useCreateNotificationMutation, useGetNotificationsQuery } = notificationsApi;
