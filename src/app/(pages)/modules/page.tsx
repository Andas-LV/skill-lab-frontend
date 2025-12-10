"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useModuleStore } from "@/entities/module/useModuleStore";
import { Button } from "@/shared/components/ui/button";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { ModuleCard } from "@/widgets/ModuleCard/ModuleCard";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { LoadingState } from "@/shared/components/LoadingState/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState/EmptyState";
import { routes } from "@/core/config/routes";
import styles from "./page.module.scss";

export default function ModulesPage() {
	const { modules, isLoading, error, fetchModules } = useModuleStore();

	useEffect(() => {
		fetchModules();
	}, [fetchModules]);

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<PageHeader
					title="Модули"
					action={
						<Link href={routes.createModule()}>
							<Button>
								<Plus className="size-4" />
								Создать модуль
							</Button>
						</Link>
					}
				/>

				{isLoading ? (
					<LoadingState message="Загрузка модулей..." />
				) : error ? (
					<ErrorState message={error} />
				) : modules.length === 0 ? (
					<EmptyState message="Модули не найдены" />
				) : (
					<div className={styles.grid}>
						{modules.map((module) => (
							<ModuleCard key={module.id} module={module} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
