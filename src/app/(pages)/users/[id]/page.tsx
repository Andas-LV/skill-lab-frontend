"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    User as UserIcon,
    Shield,
    Mail,
    Calendar,
    Heart,
    ArrowLeft,
    Loader2,
} from "lucide-react";
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

type UserDetailData = {
    id?: number;
    email?: string;
    username?: string;
    role?: "ADMIN" | "USER" | "TEACHER";
    createdAt?: string;
    updatedAt?: string;
    favoriteItems?: {
        id?: number;
        courseId?: number;
        createdAt?: string;
        course?: {
            id?: number;
            title?: string;
            image?: string | null;
            description?: string | null;
            price?: number;
            category?: "ALL" | "FRONTEND" | "MOBILE" | "BACKEND" | "DESIGN";
            createdAt?: string;
            updatedAt?: string;
        };
    }[];
};

export default function UserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id ? Number(params.id) : null;
    const { user: currentUser, fetchUser, isAuthenticated } = useUserStore();
    const [userData, setUserData] = useState<UserDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isChangingRole, setIsChangingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState<
        "ADMIN" | "USER" | "TEACHER" | null
    >(null);

    useEffect(() => {
        const checkAccess = async () => {
            await fetchUser();
        };
        checkAccess();
    }, [fetchUser]);

    useEffect(() => {
        const loadUserData = async () => {
            if (!isAuthenticated || !currentUser) {
                setError("Необходима авторизация");
                setIsLoading(false);
                router.push(routes.login());
                return;
            }

            if (!userId) {
                setError("Некорректный ID пользователя");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await userService.getUserById(userId);
                setUserData(data);
                setSelectedRole(data.role || null);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Не удалось загрузить данные пользователя";
                setError(errorMessage);
                if (
                    errorMessage.includes("401") ||
                    errorMessage.includes("Не авторизован") ||
                    errorMessage.includes("нет прав")
                ) {
                    router.push(routes.users());
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && userId) {
            loadUserData();
        }
    }, [isAuthenticated, currentUser, userId, router]);

    const handleRoleChange = async () => {
        if (!userId || !selectedRole || selectedRole === userData?.role) {
            return;
        }

        try {
            setIsChangingRole(true);
            const updatedUser = await userService.changeUserRole(userId, selectedRole);
            setUserData((prev) => (prev ? { ...prev, role: updatedUser.role } : prev));
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Не удалось изменить роль";
            setError(errorMessage);
        } finally {
            setIsChangingRole(false);
        }
    };

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

    const getCategoryLabel = (category?: string) => {
        switch (category) {
            case "FRONTEND":
                return "Frontend";
            case "BACKEND":
                return "Backend";
            case "MOBILE":
                return "Mobile";
            case "DESIGN":
                return "Дизайн";
            case "ALL":
            default:
                return "Все";
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
                        onClick={() => router.push(routes.users())}
                        className={styles.backButton}
                    >
                        <ArrowLeft className="size-4" />
                        Вернуться к списку пользователей
                    </Button>
                </div>
            </>
        );
    }

    if (!userData) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <EmptyState message="Пользователь не найден" />
                    <Button
                        variant="outline"
                        onClick={() => router.push(routes.users())}
                        className={styles.backButton}
                    >
                        <ArrowLeft className="size-4" />
                        Вернуться к списку пользователей
                    </Button>
                </div>
            </>
        );
    }

    const favoriteCourses = userData.favoriteItems?.map((item) => item.course) || [];

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Button
                    variant="ghost"
                    onClick={() => router.push(routes.users())}
                    className={styles.backButtonTop}
                >
                    <ArrowLeft className="size-4" />
                    Назад к списку
                </Button>

                <PageHeader
                    title={userData.username || `Пользователь #${userData.id}`}
                    description="Детальная информация о пользователе"
                    action={
                        <div className={styles.headerIcon}>
                            <UserIcon className="size-6" />
                        </div>
                    }
                />

                <div className={styles.content}>
                    {/* User Info Card */}
                    <div className={styles.userCard}>
                        <div className={styles.userCardHeader}>
                            <div className={styles.avatarLarge}>
                                <UserIcon className="size-12" />
                            </div>
                            <div className={styles.userCardInfo}>
                                <h2 className={styles.userCardTitle}>
                                    {userData.username || `Пользователь #${userData.id}`}
                                </h2>
                                <span className={getRoleBadgeClass(userData.role)}>
                                    <Shield className="size-3" />
                                    {getRoleLabel(userData.role)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.userCardContent}>
                            <div className={styles.infoSection}>
                                <h3 className={styles.sectionTitle}>Основная информация</h3>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <Mail className="size-4" />
                                        <span className={styles.infoLabel}>Email:</span>
                                        <span className={styles.infoValue}>
                                            {userData.email || "Не указан"}
                                        </span>
                                    </div>

                                    {userData.createdAt && (
                                        <div className={styles.infoItem}>
                                            <Calendar className="size-4" />
                                            <span className={styles.infoLabel}>Дата регистрации:</span>
                                            <span className={styles.infoValue}>
                                                {new Date(userData.createdAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    )}

                                    {userData.updatedAt && (
                                        <div className={styles.infoItem}>
                                            <Calendar className="size-4" />
                                            <span className={styles.infoLabel}>
                                                Последнее обновление:
                                            </span>
                                            <span className={styles.infoValue}>
                                                {new Date(userData.updatedAt).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Role Change Section */}
                            <div className={styles.infoSection}>
                                <h3 className={styles.sectionTitle}>Управление ролью</h3>
                                <div className={styles.roleChangeSection}>
                                    <div className={styles.roleSelector}>
                                        <label className={styles.roleOption}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="USER"
                                                checked={selectedRole === "USER"}
                                                onChange={(e) =>
                                                    setSelectedRole(e.target.value as "USER")
                                                }
                                            />
                                            <span className={styles.roleOptionLabel}>
                                                <Shield className="size-4" />
                                                Пользователь
                                            </span>
                                        </label>

                                        <label className={styles.roleOption}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="TEACHER"
                                                checked={selectedRole === "TEACHER"}
                                                onChange={(e) =>
                                                    setSelectedRole(e.target.value as "TEACHER")
                                                }
                                            />
                                            <span className={styles.roleOptionLabel}>
                                                <Shield className="size-4" />
                                                Преподаватель
                                            </span>
                                        </label>

                                        <label className={styles.roleOption}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="ADMIN"
                                                checked={selectedRole === "ADMIN"}
                                                onChange={(e) =>
                                                    setSelectedRole(e.target.value as "ADMIN")
                                                }
                                            />
                                            <span className={styles.roleOptionLabel}>
                                                <Shield className="size-4" />
                                                Администратор
                                            </span>
                                        </label>
                                    </div>

                                    <Button
                                        onClick={handleRoleChange}
                                        disabled={
                                            isChangingRole || selectedRole === userData.role
                                        }
                                        className={styles.saveRoleButton}
                                    >
                                        {isChangingRole ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Сохранение...
                                            </>
                                        ) : (
                                            "Сохранить изменения"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Favorite Courses Section */}
                    <div className={styles.favoritesSection}>
                        <div className={styles.favoritesSectionHeader}>
                            <Heart className="size-5" />
                            <h3 className={styles.sectionTitle}>
                                Избранные курсы ({favoriteCourses.length})
                            </h3>
                        </div>

                        {favoriteCourses.length === 0 ? (
                            <EmptyState message="У пользователя нет избранных курсов" />
                        ) : (
                            <div className={styles.coursesGrid}>
                                {favoriteCourses.map((course) => (
                                    <div
                                        key={course?.id}
                                        className={styles.courseCard}
                                        onClick={() =>
                                            course?.id && router.push(routes.course(course.id))
                                        }
                                    >
                                        {course?.image && (
                                            <div className={styles.courseImage}>
                                                <img src={course.image} alt={course.title || ""} />
                                            </div>
                                        )}
                                        <div className={styles.courseContent}>
                                            <h4 className={styles.courseTitle}>
                                                {course?.title || "Без названия"}
                                            </h4>
                                            {course?.description && (
                                                <p className={styles.courseDescription}>
                                                    {course.description}
                                                </p>
                                            )}
                                            <div className={styles.courseMeta}>
                                                {course?.category && (
                                                    <span className={styles.courseCategory}>
                                                        {getCategoryLabel(course.category)}
                                                    </span>
                                                )}
                                                {course?.price !== undefined && (
                                                    <span className={styles.coursePrice}>
                                                        {course.price === 0
                                                            ? "Бесплатно"
                                                            : `${course.price} ₽`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
