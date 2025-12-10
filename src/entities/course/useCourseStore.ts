import { create } from "zustand";
import { toast } from "sonner";
import { courseService } from "./courseService";
import type { CourseFormData } from "./courseSchema";
import type { SchemaCourseListItem } from "@/shared/types/api-schema";
import type { CourseCategoryType } from "@/shared/types/enums";

interface CourseState {
	courses: SchemaCourseListItem[];
	isLoading: boolean;
	isCreating: boolean;
	error: string | null;
	fetchCourses: (category?: CourseCategoryType) => Promise<void>;
	createCourse: (data: CourseFormData, onSuccess?: () => void) => Promise<void>;
	clearError: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
	courses: [],
	isLoading: false,
	isCreating: false,
	error: null,

	fetchCourses: async (category) => {
		set({ isLoading: true, error: null });
		try {
			const courses = await courseService.getList(category);
			set({ courses, isLoading: false, error: null });
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to fetch courses",
				isLoading: false,
			});
		}
	},

	createCourse: async (data, onSuccess) => {
		set({ isCreating: true, error: null });
		try {
			const courseData = {
				title: data.title,
				image: data.image || undefined,
				description: data.description || undefined,
				result:
					data.result && data.result.length > 0
						? data.result.map((item) => item.value)
						: undefined,
				link: data.link || undefined,
				price: data.price,
				category: data.category,
				moduleIds:
					data.moduleIds && data.moduleIds.length > 0
						? data.moduleIds
						: undefined,
				questions:
					data.questions && data.questions.length > 0
						? data.questions
						: undefined,
			};

			await courseService.create(courseData);
			toast.success("Курс успешно создан!");
			set({ isCreating: false, error: null });
			onSuccess?.();
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Ошибка при создании курса. Попробуйте снова.";
			set({ error: errorMessage, isCreating: false });
			toast.error(errorMessage);
		}
	},

	clearError: () => set({ error: null }),
}));
