import { openApiClient } from "@/shared/api/openApiFetch";
import type { paths } from "@/shared/types/api-schema";
import type { CourseCategoryType } from "@/shared/types/enums";

type CreateCourseRequest =
	paths["/courses/add"]["post"]["requestBody"]["content"]["application/json"];
type CreateCourseResponse =
	paths["/courses/add"]["post"]["responses"]["201"]["content"]["application/json"];

type CourseListItem =
	paths["/courses/list"]["get"]["responses"]["200"]["content"]["application/json"][number];

type CourseFullInfo =
	paths["/courses/{id}"]["get"]["responses"]["200"]["content"]["application/json"];

type UpdateCourseRequest =
	paths["/courses/{id}"]["patch"]["requestBody"]["content"]["application/json"];

type UpdateCourseResponse =
	paths["/courses/{id}"]["patch"]["responses"]["200"]["content"]["application/json"];

export const courseService = {
	create: async (
		course: CreateCourseRequest,
	): Promise<CreateCourseResponse> => {
		const { data, error, response } = await openApiClient.POST("/courses/add", {
			body: course,
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Course creation failed: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from course creation");
		}

		return data;
	},

	getList: async (category?: CourseCategoryType): Promise<CourseListItem[]> => {
		const { data, error, response } = await openApiClient.GET("/courses/list", {
			params: {
				query: category ? { category } : undefined,
			},
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to fetch courses: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from courses list");
		}

		return data;
	},

	getById: async (id: number): Promise<CourseFullInfo> => {
		const { data, error, response } = await openApiClient.GET("/courses/{id}", {
			params: {
				path: { id },
			},
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to fetch course: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from course");
		}

		return data;
	},

	update: async (
		id: number,
		course: UpdateCourseRequest,
	): Promise<UpdateCourseResponse> => {
		const { data, error, response } = await openApiClient.PATCH(
			"/courses/{id}",
			{
				params: {
					path: { id },
				},
				body: course,
			},
		);

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Course update failed: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from course update");
		}

		return data;
	},

	delete: async (id: number): Promise<void> => {
		const { error, response } = await openApiClient.DELETE("/courses/{id}", {
			params: {
				path: { id },
			},
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Course deletion failed: ${response.status}`,
			);
		}
	},
};
