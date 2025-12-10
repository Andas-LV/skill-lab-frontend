"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import CustomInput from "@/shared/components/Input";
import { Button } from "@/shared/components/ui/button";
import { moduleService } from "@/entities/module/moduleService";
import { routes } from "@/core/config/routes";

const moduleSchema = z.object({
	title: z.string().min(1, "Название модуля обязательно"),
	children: z
		.array(
			z.object({
				value: z.string().min(1, "Название урока не может быть пустым"),
			}),
		)
		.optional(),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

export default function CreateModulePage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<ModuleFormData>({
		resolver: zodResolver(moduleSchema),
		defaultValues: {
			children: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "children",
	});

	const onSubmit = async (data: ModuleFormData) => {
		setIsLoading(true);
		try {
			const moduleData = {
				title: data.title,
				children:
					data.children && data.children.length > 0
						? data.children.map((item) => item.value)
						: undefined,
			};

			const response = await moduleService.create(moduleData);

			toast.success("Модуль успешно создан!");
			router.push(routes.home());
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Ошибка при создании модуля. Попробуйте снова.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-2xl space-y-6 rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-bold">Создание модуля</h1>
					<p className="text-muted-foreground">
						Заполните информацию о модуле
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<CustomInput
						{...register("title")}
						label="Название модуля"
						type="text"
						required
						error={errors.title?.message}
					/>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium">Уроки модуля</label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ value: "" })}
							>
								<Plus className="size-4" />
								Добавить урок
							</Button>
						</div>

						{fields.length === 0 && (
							<p className="text-sm text-muted-foreground">
								Уроки не обязательны. Вы можете добавить их позже.
							</p>
						)}

						<div className="space-y-3">
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2">
									<div className="flex-1">
										<CustomInput
											{...register(`children.${index}.value`)}
											label={`Урок ${index + 1}`}
											type="text"
											error={errors.children?.[index]?.value?.message}
										/>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => remove(index)}
										className="shrink-0"
									>
										<X className="size-4" />
									</Button>
								</div>
							))}
						</div>
					</div>

					<div className="flex gap-4">
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							onClick={() => router.back()}
							disabled={isLoading}
						>
							Отмена
						</Button>
						<Button type="submit" className="flex-1" disabled={isLoading}>
							{isLoading ? "Создание..." : "Создать модуль"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

