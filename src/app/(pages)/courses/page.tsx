"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCourseStore } from "@/entities/course/useCourseStore";
import { CourseCategory, type CourseCategoryType } from "@/shared/types/enums";
import { Button } from "@/shared/components/ui/button";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { CourseCard } from "@/widgets/CourseCard/CourseCard";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { LoadingState } from "@/shared/components/LoadingState/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState/EmptyState";
import { CategoryFilter } from "./ui/CategoryFilter/CategoryFilter";
import { routes } from "@/core/config/routes";
import styles from "./page.module.scss";

export default function CoursesPage() {
	const { courses, isLoading, error, fetchCourses } = useCourseStore();
	const [selectedCategory, setSelectedCategory] = useState<CourseCategoryType>(
		CourseCategory.ALL,
	);

	useEffect(() => {
		fetchCourses();
	}, [fetchCourses]);

	const handleCategoryChange = (category: CourseCategoryType) => {
		setSelectedCategory(category);
		fetchCourses(category === CourseCategory.ALL ? undefined : category);
	};

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<PageHeader
					title="Курсы"
					action={
						<Link href={routes.createCourse()}>
							<Button>
								<Plus className="size-4" />
								Создать курс
							</Button>
						</Link>
					}
				/>

				<CategoryFilter
					value={selectedCategory}
					onChange={handleCategoryChange}
				/>

				{isLoading ? (
					<LoadingState message="Загрузка курсов..." />
				) : error ? (
					<ErrorState message={error} />
				) : courses.length === 0 ? (
					<EmptyState message="Курсы не найдены" />
				) : (
					<div className={styles.grid}>
						{courses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
