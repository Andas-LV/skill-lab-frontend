import { create } from "zustand";
import { moduleService } from "./moduleService";

type ModuleListItem = {
	id?: number;
	title?: string;
	children?: string[];
};

interface ModuleState {
	modules: ModuleListItem[];
	isLoading: boolean;
	error: string | null;
	fetchModules: () => Promise<void>;
	clearError: () => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
	modules: [],
	isLoading: false,
	error: null,

	fetchModules: async () => {
		set({ isLoading: true, error: null });
		try {
			const modules = await moduleService.getList();
			set({ modules, isLoading: false, error: null });
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to fetch modules",
				isLoading: false,
			});
		}
	},

	clearError: () => set({ error: null }),
}));
