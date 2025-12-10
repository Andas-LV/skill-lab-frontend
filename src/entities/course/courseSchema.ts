import { z } from "zod";
import { CourseCategory } from "@/shared/types/enums";

export const courseSchema = z.object({
	title: z.string().min(1, "Название курса обязательно"),
	image: z
		.string()
		.url("Некорректный URL изображения")
		.optional()
		.or(z.literal("")),
	description: z.string().optional(),
	result: z
		.array(
			z.object({
				value: z.string().min(1, "Результат не может быть пустым"),
			}),
		)
		.optional(),
	link: z.string().url("Некорректный URL").optional().or(z.literal("")),
	price: z.coerce
		.number()
		.min(0, "Цена не может быть отрицательной")
		.optional(),
	category: z
		.enum([
			CourseCategory.ALL,
			CourseCategory.FRONTEND,
			CourseCategory.MOBILE,
			CourseCategory.BACKEND,
			CourseCategory.DESIGN,
		])
		.optional(),
	moduleIds: z.array(z.number()).optional(),
	questions: z
		.array(
			z.object({
				title: z.string().min(1, "Вопрос не может быть пустым"),
				options: z
					.array(
						z.object({
							answerName: z.string().min(1, "Ответ не может быть пустым"),
							right: z.boolean(),
						}),
					)
					.min(2, "Должно быть минимум 2 варианта ответа"),
			}),
		)
		.optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
