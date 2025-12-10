import { create } from "zustand";
import type { SchemaUser } from "@/shared/types/api-schema";
import { setAuthToken, removeAuthToken, getAuthToken } from "@/core/config/cookie";
import { userService } from "./userService";

interface UserState {
	user: SchemaUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	setUser: (user: SchemaUser | null, token?: string) => void;
	fetchUser: () => Promise<void>;
	logout: () => void;
	clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	setUser: (user, token) => {
		if (user && token) {
			setAuthToken(token);
			set({ user, isAuthenticated: true, error: null });
		} else {
			set({ user: null, isAuthenticated: false });
		}
	},

	fetchUser: async () => {
		const token = getAuthToken();
		if (!token) {
			set({ user: null, isAuthenticated: false });
			return;
		}

		set({ isLoading: true, error: null });
		try {
			const user = await userService.getMe();
			set({ user, isAuthenticated: true, isLoading: false, error: null });
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch user",
				isLoading: false,
				isAuthenticated: false,
				user: null,
			});
		}
	},

	logout: () => {
		removeAuthToken();
		set({ user: null, isAuthenticated: false, error: null });
	},

	clearError: () => set({ error: null }),
}));

