import { openApiClient } from "@/shared/api/openApiFetch";
import type { paths } from "@/shared/types/api-schema";

type CreateModuleRequest =
	paths["/modules/add"]["post"]["requestBody"]["content"]["application/json"];
type CreateModuleResponse =
	paths["/modules/add"]["post"]["responses"]["201"]["content"]["application/json"];

type ModuleListItem =
	paths["/modules/list"]["get"]["responses"]["200"]["content"]["application/json"][number];

type UpdateModuleRequest =
	paths["/modules/{id}"]["patch"]["requestBody"]["content"]["application/json"];

type UpdateModuleResponse =
	paths["/modules/{id}"]["patch"]["responses"]["200"]["content"]["application/json"];

export const moduleService = {
	create: async (module: CreateModuleRequest): Promise<CreateModuleResponse> => {
		const { data, error, response } = await openApiClient.POST("/modules/add", {
			body: module,
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Module creation failed: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from module creation");
		}

		return data;
	},

	getList: async (): Promise<ModuleListItem[]> => {
		const { data, error, response } = await openApiClient.GET("/modules/list");

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Failed to fetch modules: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from modules list");
		}

		return data;
	},

	update: async (
		id: number,
		module: UpdateModuleRequest,
	): Promise<UpdateModuleResponse> => {
		const { data, error, response } = await openApiClient.PATCH("/modules/{id}", {
			params: {
				path: { id },
			},
			body: module,
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Module update failed: ${response.status}`,
			);
		}

		if (!data) {
			throw new Error("No data received from module update");
		}

		return data;
	},

	delete: async (id: number): Promise<void> => {
		const { error, response } = await openApiClient.DELETE("/modules/{id}", {
			params: {
				path: { id },
			},
		});

		if (error) {
			throw new Error(
				error instanceof Error
					? error.message
					: `Module deletion failed: ${response.status}`,
			);
		}
	},
};

