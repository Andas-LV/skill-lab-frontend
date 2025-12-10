"use client";

import Link from "next/link";
import type { SchemaCourseListItem } from "@/shared/types/api-schema";
import { routes } from "@/core/config/routes";
import styles from "./CourseCard.module.scss";

interface CourseCardProps {
	course: SchemaCourseListItem;
}

export function CourseCard({ course }: CourseCardProps) {
	return (
		<Link href={routes.course(course.id ?? 0)} className={styles.card}>
			{course.image && (
				<div className={styles.imageWrapper}>
					<img src={course.image} alt={course.title} className={styles.image} />
				</div>
			)}
			<div className={styles.content}>
				<h3 className={styles.title}>{course.title}</h3>
				{course.category && (
					<span className={styles.category}>{course.category}</span>
				)}
				{course.price !== undefined && (
					<div className={styles.price}>
						{course.price === 0 ? "Бесплатно" : `${course.price} Тенге`}
					</div>
				)}
				{course.modulesCount !== undefined && (
					<div className={styles.modulesCount}>
						Модулей: {course.modulesCount}
					</div>
				)}
			</div>
		</Link>
	);
}
