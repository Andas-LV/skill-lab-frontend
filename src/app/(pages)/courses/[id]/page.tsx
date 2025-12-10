"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import CustomInput from "@/shared/components/Input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	courseSchema,
	type CourseFormData,
} from "@/entities/course/courseSchema";
import { courseService } from "@/entities/course/courseService";
import { CourseCategory } from "@/shared/types/enums";
import { routes } from "@/core/config/routes";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { LoadingState } from "@/shared/components/LoadingState/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState/ErrorState";
import { toast } from "sonner";
import styles from "./page.module.scss";

export default function CourseDetailPage() {
	const params = useParams();
	const router = useRouter();
	const courseId = Number(params.id);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<CourseFormData>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			moduleIds: [],
			questions: [],
			result: [],
		},
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
		const fetchCourse = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const course = await courseService.getById(courseId);
				reset({
					title: course.title || "",
					image: course.image || "",
					description: course.description || "",
					price: course.price,
					category: course.category || CourseCategory.ALL,
					link: course.link || "",
					result: course.result?.map((r) => ({ value: r })) || [],
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Не удалось загрузить курс",
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (courseId) {
			fetchCourse();
		}
	}, [courseId, reset]);

	const onSubmit = async (data: CourseFormData) => {
		try {
			setIsSaving(true);
			setError(null);
			await courseService.update(courseId, {
				title: data.title,
				image: data.image || undefined,
				description: data.description || undefined,
				price: data.price,
				category: data.category,
				link: data.link || undefined,
				result:
					data.result && data.result.length > 0
						? data.result.map((item) => item.value)
						: undefined,
			});
			toast.success("Курс успешно обновлен!");
			router.refresh();
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Ошибка при обновлении курса. Попробуйте снова.";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			setError(null);
			await courseService.delete(courseId);
			toast.success("Курс успешно удален!");
			router.push(routes.courses());
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Ошибка при удалении курса. Попробуйте снова.";
			setError(errorMessage);
			toast.error(errorMessage);
			setShowDeleteConfirm(false);
		} finally {
			setIsDeleting(false);
		}
	};

	if (isLoading) {
		return (
			<>
				<Navbar />
				<div className={styles.container}>
					<LoadingState message="Загрузка курса..." />
				</div>
			</>
		);
	}

	if (error && !isLoading) {
		return (
			<>
				<Navbar />
				<div className={styles.container}>
					<ErrorState message={error} />
					<Link href={routes.courses()}>
						<Button variant="outline" className={styles.backButton}>
							<ArrowLeft className="size-4 mr-2" />
							Вернуться к списку курсов
						</Button>
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<PageHeader
					title="Редактирование курса"
					action={
						<Link href={routes.courses()}>
							<Button variant="outline">
								<ArrowLeft className="size-4 mr-2" />
								Назад
							</Button>
						</Link>
					}
				/>

				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<div className={styles.grid}>
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

					<div className={styles.field}>
						<Label htmlFor="description">Описание курса</Label>
						<Textarea
							{...register("description")}
							id="description"
							className={styles.textarea}
							aria-invalid={errors.description ? "true" : "false"}
						/>
						{errors.description && (
							<p className={styles.errorText}>{errors.description.message}</p>
						)}
					</div>

					<div className={styles.field}>
						<Label>Категория</Label>
						<Controller
							name="category"
							control={control}
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue placeholder="Выберите категорию" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={CourseCategory.ALL}>Все</SelectItem>
										<SelectItem value={CourseCategory.FRONTEND}>
											Frontend
										</SelectItem>
										<SelectItem value={CourseCategory.BACKEND}>
											Backend
										</SelectItem>
										<SelectItem value={CourseCategory.MOBILE}>
											Mobile
										</SelectItem>
										<SelectItem value={CourseCategory.DESIGN}>
											Design
										</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<CustomInput
						{...register("link")}
						label="Ссылка на курс"
						type="url"
						error={errors.link?.message}
					/>

					<div className={styles.field}>
						<div className={styles.fieldHeader}>
							<Label>Результаты обучения</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendResult({ value: "" })}
							>
								<Plus className="size-4 mr-2" />
								Добавить результат
							</Button>
						</div>
						{resultFields.map((field, index) => (
							<div key={field.id} className={styles.arrayItem}>
								<CustomInput
									{...register(`result.${index}.value`)}
									placeholder="Результат обучения"
									error={errors.result?.[index]?.value?.message}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeResult(index)}
								>
									<X className="size-4" />
								</Button>
							</div>
						))}
					</div>

					{error && <ErrorState message={error} />}

					<div className={styles.actions}>
						<Button
							type="button"
							variant="destructive"
							onClick={() => setShowDeleteConfirm(true)}
							disabled={isSaving || isDeleting}
							className={styles.deleteButton}
						>
							<Trash2 className="size-4 mr-2" />
							Удалить курс
						</Button>
						<Button type="submit" disabled={isSaving || isDeleting}>
							<Save className="size-4 mr-2" />
							{isSaving ? "Сохранение..." : "Сохранить изменения"}
						</Button>
					</div>

					{showDeleteConfirm && (
						<div className={styles.deleteConfirm}>
							<div className={styles.deleteConfirmContent}>
								<h3 className={styles.deleteConfirmTitle}>
									Подтверждение удаления
								</h3>
								<p className={styles.deleteConfirmText}>
									Вы уверены, что хотите удалить этот курс? Это действие нельзя
									отменить.
								</p>
								<div className={styles.deleteConfirmActions}>
									<Button
										variant="outline"
										onClick={() => setShowDeleteConfirm(false)}
										disabled={isDeleting}
									>
										Отмена
									</Button>
									<Button
										variant="destructive"
										onClick={handleDelete}
										disabled={isDeleting}
									>
										{isDeleting ? "Удаление..." : "Удалить"}
									</Button>
								</div>
							</div>
						</div>
					)}
				</form>
			</div>
		</>
	);
}
