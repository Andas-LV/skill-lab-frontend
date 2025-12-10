"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/entities/user/useUserStore";
import { Button } from "@/shared/components/ui/button";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { PageHeader } from "@/shared/components/PageHeader/PageHeader";
import { LoadingState } from "@/shared/components/LoadingState/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState/ErrorState";
import { LogOut, User as UserIcon, Mail, Calendar } from "lucide-react";
import { routes } from "@/core/config/routes";
import styles from "./page.module.scss";

export default function ProfilePage() {
	const router = useRouter();
	const { user, isLoading, error, fetchUser, logout } = useUserStore();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const handleLogout = () => {
		logout();
		router.push(routes.login());
	};

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<PageHeader title="Профиль" description="Информация о вашем аккаунте" />

				{isLoading ? (
					<LoadingState message="Загрузка профиля..." />
				) : error || !user ? (
					<ErrorState message={error || "Пользователь не найден"} />
				) : (
					<div className={styles.card}>
						<div className={styles.content}>
							<div className={styles.userHeader}>
								<div className={styles.avatar}>
									<UserIcon className="size-8 text-primary" />
								</div>
								<div>
									<h2 className={styles.userName}>
										{user.username || "Пользователь"}
									</h2>
									<p className={styles.userEmail}>{user.email}</p>
								</div>
							</div>

							<div className={styles.infoGrid}>
								<div className={styles.infoItem}>
									<Mail className="size-5 text-muted-foreground" />
									<div>
										<p className={styles.infoLabel}>Email</p>
										<p className={styles.infoValue}>
											{user.email || "Не указан"}
										</p>
									</div>
								</div>

								<div className={styles.infoItem}>
									<UserIcon className="size-5 text-muted-foreground" />
									<div>
										<p className={styles.infoLabel}>Имя пользователя</p>
										<p className={styles.infoValue}>
											{user.username || "Не указано"}
										</p>
									</div>
								</div>

								{user.createdAt && (
									<div className={styles.infoItem}>
										<Calendar className="size-5 text-muted-foreground" />
										<div>
											<p className={styles.infoLabel}>Дата регистрации</p>
											<p className={styles.infoValue}>
												{new Date(user.createdAt).toLocaleDateString("ru-RU")}
											</p>
										</div>
									</div>
								)}

								{user.updatedAt && (
									<div className={styles.infoItem}>
										<Calendar className="size-5 text-muted-foreground" />
										<div>
											<p className={styles.infoLabel}>Последнее обновление</p>
											<p className={styles.infoValue}>
												{new Date(user.updatedAt).toLocaleDateString("ru-RU")}
											</p>
										</div>
									</div>
								)}
							</div>

							<div className={styles.logoutSection}>
								<Button
									variant="destructive"
									onClick={handleLogout}
									className={styles.logoutButton}
								>
									<LogOut className="size-4 mr-2" />
									Выйти из аккаунта
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
