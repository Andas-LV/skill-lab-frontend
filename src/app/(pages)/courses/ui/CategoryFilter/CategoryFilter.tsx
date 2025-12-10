"use client";

import { CourseCategory, type CourseCategoryType } from "@/shared/types/enums";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import styles from "./CategoryFilter.module.scss";

interface CategoryFilterProps {
	value: CourseCategoryType;
	onChange: (category: CourseCategoryType) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
	return (
		<div className={styles.container}>
			<Select
				value={value}
				onValueChange={(val) => onChange(val as CourseCategoryType)}
			>
				<SelectTrigger className={styles.trigger}>
					<SelectValue placeholder="Фильтр по категории" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={CourseCategory.ALL}>Все категории</SelectItem>
					<SelectItem value={CourseCategory.FRONTEND}>Frontend</SelectItem>
					<SelectItem value={CourseCategory.BACKEND}>Backend</SelectItem>
					<SelectItem value={CourseCategory.MOBILE}>Mobile</SelectItem>
					<SelectItem value={CourseCategory.DESIGN}>Design</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
