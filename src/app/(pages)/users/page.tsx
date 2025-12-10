"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Shield, Mail, Calendar, User as UserIcon } from "lucide-react";
import { useUserStore } from "@/entities/user/useUserStore";
import { userService } from "@/entities/user/userService";
import { UserRole } from "@/shared/types/enums";
import { Button } from "@/shared/components/ui/button";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { LoadingState } from "@/shared/components/LoadingState/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState/EmptyState";
import { routes } from "@/core/config/routes";
import styles from "./page.module.scss";

type UserWithRole = {
	id?: number;
	email?: string;
	username?: string;
	role?: "ADMIN" | "USER" | "TEACHER";
	createdAt?: string;
	updatedAt?: string;
};

export default function UsersPage() {
	const router = useRouter();
	const { user, fetchUser, isAuthenticated } = useUserStore();
	const [users, setUsers] = useState<UserWithRole[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const checkAccess = async () => {
			await fetchUser();
		};
		checkAccess();
	}, [fetchUser]);

	useEffect(() => {
		const loadUsers = async () => {
			// Проверяем, что пользователь авторизован и является админом
			if (!isAuthenticated || !user) {
				setError("Необходима авторизация");
				setIsLoading(false);
				router.push(routes.login());
				return;
			}

			// Проверяем роль пользователя через API
			// Так как в SchemaUser нет role, мы проверим доступ через попытку загрузки
			try {
				setIsLoading(true);
				setError(null);
				const usersData = await userService.getAll();
				setUsers(usersData);
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Не удалось загрузить список пользователей";
				setError(errorMessage);
				if (
					errorMessage.includes("401") ||
					errorMessage.includes("Не авторизован") ||
					errorMessage.includes("нет прав")
				) {
					router.push(routes.home());
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (isAuthenticated) {
			loadUsers();
		}
	}, [isAuthenticated, user, router]);

	const getRoleBadgeClass = (role?: string) => {
		switch (role) {
			case UserRole.ADMIN:
				return styles.roleAdmin;
			case UserRole.TEACHER:
				return styles.roleTeacher;
			case UserRole.USER:
				return styles.roleUser;
			default:
				return styles.roleUser;
		}
	};

	const getRoleLabel = (role?: string) => {
		switch (role) {
			case UserRole.ADMIN:
				return "Администратор";
			case UserRole.TEACHER:
				return "Преподаватель";
			case UserRole.USER:
				return "Пользователь";
			default:
				return "Пользователь";
		}
	};

	if (!isAuthenticated || isLoading) {
		return (
			<>
				<Navbar />
				<div className={styles.container}>
					<LoadingState message="Загрузка..." />
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<Navbar />
				<div className={styles.container}>
					<ErrorState message={error} />
					<Button
						variant="outline"
						onClick={() => router.push(routes.home())}
						className={styles.backButton}
					>
						Вернуться на главную
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<PageHeader
					title="Пользователи"
					description="Управление пользователями системы"
					action={
						<div className={styles.headerIcon}>
							<Users className="size-6" />
						</div>
					}
				/>

				{users.length === 0 ? (
					<EmptyState message="Пользователи не найдены" />
				) : (
					<div className={styles.grid}>
						{users.map((userItem) => (
							<div key={userItem.id} className={styles.card}>
								<div className={styles.cardHeader}>
									<div className={styles.avatar}>
										<UserIcon className="size-6" />
									</div>
									<div className={styles.userInfo}>
										<h3 className={styles.userName}>
											{userItem.username || `Пользователь #${userItem.id}`}
										</h3>
										<div className={styles.userMeta}>
											<span className={getRoleBadgeClass(userItem.role)}>
												<Shield className="size-3" />
												{getRoleLabel(userItem.role)}
											</span>
										</div>
									</div>
								</div>

								<div className={styles.cardContent}>
									<div className={styles.infoItem}>
										<Mail className="size-4" />
										<span className={styles.infoLabel}>Email:</span>
										<span className={styles.infoValue}>
											{userItem.email || "Не указан"}
										</span>
									</div>

									{userItem.createdAt && (
										<div className={styles.infoItem}>
											<Calendar className="size-4" />
											<span className={styles.infoLabel}>
												Дата регистрации:
											</span>
											<span className={styles.infoValue}>
												{new Date(userItem.createdAt).toLocaleDateString(
													"ru-RU",
												)}
											</span>
										</div>
									)}

									{userItem.updatedAt && (
										<div className={styles.infoItem}>
											<Calendar className="size-4" />
											<span className={styles.infoLabel}>
												Последнее обновление:
											</span>
											<span className={styles.infoValue}>
												{new Date(userItem.updatedAt).toLocaleDateString(
													"ru-RU",
												)}
											</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
