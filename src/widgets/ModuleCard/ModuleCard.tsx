"use client";

import Link from "next/link";
import { routes } from "@/core/config/routes";
import styles from "./ModuleCard.module.scss";

interface ModuleCardProps {
	module: {
		id?: number;
		title?: string;
		children?: string[];
	};
}

export function ModuleCard({ module }: ModuleCardProps) {
	return (
		<Link href={routes.module(module.id ?? 0)} className={styles.card}>
			<div className={styles.content}>
				<h3 className={styles.title}>
					{module.title || `Модуль #${module.id}`}
				</h3>
				{module.children && module.children.length > 0 && (
					<div className={styles.lessons}>
						<h4 className={styles.lessonsTitle}>Уроки:</h4>
						<ul className={styles.lessonsList}>
							{module.children.map((child, index) => (
								<li key={index} className={styles.lessonItem}>
									• {child}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</Link>
	);
}
