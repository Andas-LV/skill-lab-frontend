"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import CustomInput from "@/shared/components/Input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { moduleService } from "@/entities/module/moduleService";
import { routes } from "@/core/config/routes";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { LoadingState } from "@/shared/components/LoadingState/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState/ErrorState";
import { toast } from "sonner";
import styles from "./page.module.scss";

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

export default function ModuleDetailPage() {
	const params = useParams();
	const router = useRouter();
	const moduleId = Number(params.id);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [moduleData, setModuleData] = useState<{
		id?: number;
		title?: string;
		children?: string[];
	} | null>(null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<ModuleFormData>({
		resolver: zodResolver(moduleSchema),
		defaultValues: {
			children: [],
		},
	});

	const {
		fields: childrenFields,
		append: appendChild,
		remove: removeChild,
	} = useFieldArray({
		control,
		name: "children",
	});

	useEffect(() => {
		const fetchModule = async () => {
			try {
				setIsLoading(true);
				setError(null);
				// Получаем модуль из списка, так как нет отдельного эндпоинта
				const modules = await moduleService.getList();
				const module = modules.find((m) => m.id === moduleId);
				if (!module) {
					throw new Error("Модуль не найден");
				}
				setModuleData(module);
				reset({
					title: module.title || "",
					children:
						module.children?.map((child) => ({ value: child })) || [],
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Не удалось загрузить модуль",
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (moduleId) {
			fetchModule();
		}
	}, [moduleId, reset]);

	const onSubmit = async (data: ModuleFormData) => {
		try {
			setIsSaving(true);
			setError(null);
			await moduleService.update(moduleId, {
				title: data.title,
				children:
					data.children && data.children.length > 0
						? data.children.map((item) => item.value)
						: undefined,
			});
			toast.success("Модуль успешно обновлен!");
			router.refresh();
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Ошибка при обновлении модуля. Попробуйте снова.";
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
			await moduleService.delete(moduleId);
			toast.success("Модуль успешно удален!");
			router.push(routes.modules());
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Ошибка при удалении модуля. Попробуйте снова.";
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
					<LoadingState message="Загрузка модуля..." />
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
					<Link href={routes.modules()}>
						<Button variant="outline" className={styles.backButton}>
							<ArrowLeft className="size-4 mr-2" />
							Вернуться к списку модулей
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
					title="Редактирование модуля"
					action={
						<Link href={routes.modules()}>
							<Button variant="outline">
								<ArrowLeft className="size-4 mr-2" />
								Назад
							</Button>
						</Link>
					}
				/>

				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<CustomInput
						{...register("title")}
						label="Название модуля"
						type="text"
						required
						error={errors.title?.message}
					/>

					<div className={styles.field}>
						<div className={styles.fieldHeader}>
							<Label>Уроки (children)</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendChild({ value: "" })}
							>
								<Plus className="size-4 mr-2" />
								Добавить урок
							</Button>
						</div>
						{childrenFields.map((field, index) => (
							<div key={field.id} className={styles.arrayItem}>
								<CustomInput
									{...register(`children.${index}.value`)}
									placeholder="Название урока"
									error={errors.children?.[index]?.value?.message}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeChild(index)}
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
							Удалить модуль
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
									Вы уверены, что хотите удалить этот модуль? Это действие
									нельзя отменить. Модуль нельзя удалить, если он используется
									в курсах.
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

