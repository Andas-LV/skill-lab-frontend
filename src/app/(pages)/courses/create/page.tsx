"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import CustomInput from "@/shared/components/Input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { courseSchema, type CourseFormData } from "@/entities/course/courseSchema";
import { useCourseStore } from "@/entities/course/useCourseStore";
import { useModuleStore } from "@/entities/module/useModuleStore";
import { CourseCategory } from "@/shared/types/enums";
import { routes } from "@/core/config/routes";

export default function CreateCoursePage() {
	const router = useRouter();
	const { modules, isLoading: modulesLoading, fetchModules } = useModuleStore();
	const { isCreating, createCourse } = useCourseStore();

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CourseFormData>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			moduleIds: [],
			questions: [],
			result: [],
		},
	});

	const selectedModuleIds = watch("moduleIds") || [];

	const {
		fields: questionFields,
		append: appendQuestion,
		remove: removeQuestion,
	} = useFieldArray({
		control,
		name: "questions",
	});

	const {
		fields: resultFields,
		append: appendResult,
		remove: removeResult,
	} = useFieldArray({
		control,
		name: "result",
	});

	useEffect(() => {
		fetchModules();
	}, [fetchModules]);

	const toggleModule = (moduleId: number) => {
		const currentIds = selectedModuleIds;
		if (currentIds.includes(moduleId)) {
			setValue(
				"moduleIds",
				currentIds.filter((id) => id !== moduleId),
			);
		} else {
			setValue("moduleIds", [...currentIds, moduleId]);
		}
	};

	const onSubmit = async (data: CourseFormData) => {
		await createCourse(data, () => {
			router.push(routes.home());
		});
	};

	return (
		<div className="container mx-auto max-w-4xl py-8 px-4">
			<div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-2">
					<h1 className="text-2xl font-bold">Создание курса</h1>
					<p className="text-muted-foreground">
						Заполните информацию о курсе
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2">
						<CustomInput
							{...register("title")}
							label="Название курса"
							type="text"
							required
							error={errors.title?.message}
						/>

						<CustomInput
							{...register("price", { valueAsNumber: true })}
							label="Цена"
							type="number"
							error={errors.price?.message}
						/>
					</div>

					<CustomInput
						{...register("image")}
						label="URL изображения"
						type="url"
						error={errors.image?.message}
					/>

					<div className="space-y-2">
						<Label htmlFor="description">Описание курса</Label>
						<Textarea
							{...register("description")}
							id="description"
							className="min-h-[100px]"
							aria-invalid={errors.description ? "true" : "false"}
						/>
						{errors.description && (
							<p className="text-sm text-destructive">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label>Категория</Label>
						<Select
							onValueChange={(value) =>
								setValue("category", value as CourseFormData["category"])
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Выберите категорию" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={CourseCategory.ALL}>Все</SelectItem>
								<SelectItem value={CourseCategory.FRONTEND}>Frontend</SelectItem>
								<SelectItem value={CourseCategory.BACKEND}>Backend</SelectItem>
								<SelectItem value={CourseCategory.MOBILE}>Mobile</SelectItem>
								<SelectItem value={CourseCategory.DESIGN}>Design</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<CustomInput
						{...register("link")}
						label="Ссылка на курс"
						type="url"
						error={errors.link?.message}
					/>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Результаты обучения</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendResult({ value: "" })}
							>
								<Plus className="size-4" />
								Добавить результат
							</Button>
						</div>

						<div className="space-y-3">
							{resultFields.map((field, index) => (
								<div key={field.id} className="flex gap-2">
									<div className="flex-1">
										<CustomInput
											{...register(`result.${index}.value`)}
											label={`Результат ${index + 1}`}
											type="text"
											error={errors.result?.[index]?.value?.message}
										/>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeResult(index)}
										className="shrink-0"
									>
										<X className="size-4" />
									</Button>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<Label>Модули курса</Label>
						{modulesLoading ? (
							<p className="text-sm text-muted-foreground">Загрузка модулей...</p>
						) : modules.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Модули не найдены. Создайте модули сначала.
							</p>
						) : (
							<div className="space-y-2 rounded-md border p-4">
								{modules.map(
									(module) =>
										module.id && (
											<div
												key={module.id}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`module-${module.id}`}
													checked={selectedModuleIds.includes(module.id)}
													onCheckedChange={() => toggleModule(module.id!)}
												/>
												<Label
													htmlFor={`module-${module.id}`}
													className="font-normal cursor-pointer"
												>
													{module.title || `Модуль #${module.id}`}
												</Label>
											</div>
										),
								)}
							</div>
						)}
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label>Вопросы для тестирования</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									appendQuestion({
										title: "",
										options: [
											{ answerName: "", right: false },
											{ answerName: "", right: false },
										],
									})
								}
							>
								<Plus className="size-4" />
								Добавить вопрос
							</Button>
						</div>

						<div className="space-y-6">
							{questionFields.map((questionField, questionIndex) => (
								<div
									key={questionField.id}
									className="space-y-4 rounded-lg border p-4"
								>
									<div className="flex items-center justify-between">
										<h3 className="font-medium">
											Вопрос {questionIndex + 1}
										</h3>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeQuestion(questionIndex)}
										>
											<X className="size-4" />
										</Button>
									</div>

									<CustomInput
										{...register(`questions.${questionIndex}.title`)}
										label="Текст вопроса"
										type="text"
										required
										error={errors.questions?.[questionIndex]?.title?.message}
									/>

									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<Label>Варианты ответов</Label>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													const currentOptions =
														watch(`questions.${questionIndex}.options`) || [];
													setValue(
														`questions.${questionIndex}.options`,
														[
															...currentOptions,
															{ answerName: "", right: false },
														],
													);
												}}
											>
												<Plus className="size-4" />
												Добавить вариант
											</Button>
										</div>
										{questionField.options?.map((_, optionIndex) => (
											<div
												key={optionIndex}
												className="flex items-center gap-2"
											>
												<Controller
													control={control}
													name={`questions.${questionIndex}.options.${optionIndex}.right`}
													render={({ field }) => (
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													)}
												/>
												<div className="flex-1">
													<CustomInput
														{...register(
															`questions.${questionIndex}.options.${optionIndex}.answerName`,
														)}
														label={`Вариант ${optionIndex + 1}`}
														type="text"
														error={
															errors.questions?.[questionIndex]?.options?.[
																optionIndex
															]?.answerName?.message
														}
													/>
												</div>
												{questionField.options &&
													questionField.options.length > 2 && (
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => {
																const currentOptions =
																	watch(
																		`questions.${questionIndex}.options`,
																	) || [];
																setValue(
																	`questions.${questionIndex}.options`,
																	currentOptions.filter(
																		(_, i) => i !== optionIndex,
																	),
																);
															}}
															className="shrink-0"
														>
															<X className="size-4" />
														</Button>
													)}
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex gap-4 pt-4">
						<Button
							type="button"
							variant="outline"
							className="flex-1"
							onClick={() => router.back()}
							disabled={isCreating}
						>
							Отмена
						</Button>
						<Button type="submit" className="flex-1" disabled={isCreating}>
							{isCreating ? "Создание..." : "Создать курс"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

