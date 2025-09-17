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
      query: ({ search = "", page = 1, limit }) => ({
        url: "/courses/all-course",
        method: "GET",
        params: { search, page, limit },
      }),
      providesTags: ["courses"],
    }),
    getMicroLearning: builder.query({
      query: (search: string) => ({
        url: "/courses/all-micro-courses",
        method: "GET",
        params: { search },
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
    getCourseById: builder.query({
      query: (id) => ({
        url: `/courses/single-course/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    editCourse: builder.mutation({
      query: (data) => {
        const isFormData = data.formData instanceof FormData;

        return {
          url: `/courses/update-courseInfo/${data.id}`,
          method: "PUT",
          body: data.formData,
          headers: isFormData
            ? undefined
            : { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: ["courses"],
    }),
    addCourseModule: builder.mutation({
      query: (data) => ({
        url: `/courses/add-module/${data.id}`,
        method: "POST",
        body: data.formData,
      }),
      invalidatesTags: ["courses"],
    }),
    addCourseLesson: builder.mutation<
      { success: boolean; message?: string },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/courses/add-lesson/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["courses"],
    }),
    editModule: builder.mutation({
      query: ({ moduleId, title }: { moduleId: string; title: string }) => ({
        url: `/courses/update-module/${moduleId}`,
        method: "PATCH",
        body: { title },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["courses"],
    }),
    editLesson: builder.mutation<
      { success: boolean; message?: string },
      { moduleId: string; lessonId: string; formData: FormData }
    >({
      query: ({ moduleId, lessonId, formData }) => ({
        url: `/courses/update-lesson/${moduleId}/${lessonId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["courses"],
    }),
    // NEW: Delete Lesson endpoint
    deleteLesson: builder.mutation<
      { success: boolean; message?: string },
      { lessonId: string }
    >({
      query: ({ lessonId }) => ({
        url: `/courses/delete-lesson/${lessonId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courses"],
    }),
    getMyCourseProgress: builder.query({
      query: (id) => ({
        url: `/courses/my-single-course-progress/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
    addCourseStudent: builder.mutation({
      query: ({ courseId, firstName, lastName, email }) => ({
        url: `/users/add-student`,
        method: "POST",
        body: { courseId, firstName, lastName, email },
      }),
      invalidatesTags: ["courses"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId: string) => ({
        url: `/courses/delete-course/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["courses"],
    }),
    getStudentsInCourse: builder.query({
      query: (id) => ({
        url: `/courses/enroll-student/${id}`,
        method: "GET",
      }),
      providesTags: ["courses"],
    }),
  }),
});

export const {
  useAddMicroLearningMutation,
  useGetAllCoursesQuery,
  useGetMyCoursesQuery,
  useGetCourseByIdQuery,
  useEditCourseMutation,
  useGetMicroLearningQuery,
  useAddCourseModuleMutation,
  useAddCourseLessonMutation,
  useEditModuleMutation,
  useEditLessonMutation,
  useDeleteLessonMutation,
  useGetMyCourseProgressQuery,
  useAddCourseStudentMutation,
  useDeleteCourseMutation,
  useGetStudentsInCourseQuery,
} = coursesApi;
