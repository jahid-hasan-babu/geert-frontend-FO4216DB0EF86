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
			query: (search: string) => ({
				url: "/courses/all-course",
				method: "GET",
				params: { search },
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
			invalidatesTags: (result, error, { id }) => [{ type: "courses", id }],
		}),
		addCourseModule: builder.mutation({
			query: (data) => ({
				url: `/courses/add-module/${data.id}`,
				method: "POST",
				body: data.formData,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "courses", id }],
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
			invalidatesTags: (result, error, { id }) => [{ type: "courses", id }],
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
} = coursesApi;
