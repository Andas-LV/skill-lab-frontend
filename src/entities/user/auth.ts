import { openApiClient } from "@/shared/api/openApiFetch";
import type { paths } from "@/shared/types/api-schema";

type LoginRequest =
	paths["/auth/login"]["post"]["requestBody"]["content"]["application/json"];
type LoginResponse =
	paths["/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];

export const authService = {
	login: async (credentials: LoginRequest): Promise<LoginResponse> => {
		const { data, error, response } = await openApiClient.POST("/auth/login", {
			body: credentials,
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Login failed: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from login");
		}

		return data;
	},
};
