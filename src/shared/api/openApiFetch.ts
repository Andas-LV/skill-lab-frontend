import createClient from "openapi-fetch";
import type { paths } from "@/shared/types/api-schema";
import { getAuthToken } from "@/core/config/cookie";

const isClient = typeof window !== "undefined";

export const openApiClient = createClient<paths>({
	baseUrl: process.env.NEXT_BACKEND_URL,
});

openApiClient.use({
	onRequest: async ({ request }) => {
		if (isClient) {
			const token = getAuthToken();

			if (!token) {
				console.warn("⚠️ No access token available! Request may fail.");
			} else {
				request.headers.set("Authorization", `Bearer ${token}`);
			}

			return request;
		}
	},
	onResponse: async ({ response }) => {
		if (!response.ok) {
			console.error("API Error:", response.status, await response.text());
		}
		return response;
	},
	onError: async ({ error }) => {
		console.error("Network error:", error);
		throw error;
	},
});
