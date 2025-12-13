import { openApiClient } from "@/shared/api/openApiFetch";
import type { paths } from "@/shared/types/api-schema";

type GetUserResponse =
	paths["/user/me"]["get"]["responses"]["200"]["content"]["application/json"];

type GetAllUsersResponse =
	paths["/user/all"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUserByIdResponse =
	paths["/user/{userId}"]["get"]["responses"]["200"]["content"]["application/json"];

type ChangeUserRoleRequest =
	paths["/user/{userId}/change-role"]["patch"]["requestBody"]["content"]["application/json"];

type ChangeUserRoleResponse =
	paths["/user/{userId}/change-role"]["patch"]["responses"]["200"]["content"]["application/json"];

export const userService = {
	getMe: async (): Promise<GetUserResponse> => {
		const { data, error, response } = await openApiClient.GET("/user/me");

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to fetch user: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from user");
		}

		return data;
	},

	getAll: async (): Promise<GetAllUsersResponse> => {
		const { data, error, response } = await openApiClient.GET("/user/all");

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to fetch users: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from users list");
		}

		return data;
	},

	getUserById: async (userId: number): Promise<GetUserByIdResponse> => {
		const { data, error, response } = await openApiClient.GET(
			"/user/{userId}",
			{
				params: {
					path: { userId },
				},
			},
		);

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to fetch user: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from user");
		}

		return data;
	},

	changeUserRole: async (
		userId: number,
		role: ChangeUserRoleRequest["role"],
	): Promise<ChangeUserRoleResponse> => {
		const { data, error, response } = await openApiClient.PATCH(
			"/user/{userId}/change-role",
			{
				params: {
					path: { userId },
				},
				body: { role },
			},
		);

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to change user role: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from role change");
		}

		return data;
	},
};
