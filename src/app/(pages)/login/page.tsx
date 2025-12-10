"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import CustomInput from "@/shared/components/Input";
import { Button } from "@/shared/components/ui/button";
import { authService } from "@/entities/user/auth";
import { useUserStore } from "@/entities/user/useUserStore";
import { routes } from "@/core/config/routes";

const loginSchema = z.object({
	username: z.string().min(1, "Имя пользователя обязательно"),
	password: z.string().min(1, "Пароль обязателен"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const { setUser } = useUserStore();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		try {
			const response = await authService.login({
				username: data.username,
				password: data.password,
			});

			if (response.token && response.user) {
				setUser(response.user, response.token);
				toast.success("Успешный вход!");
				router.push(routes.home());
			} else {
				toast.error("Ошибка: токен или данные пользователя отсутствуют");
			}
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Ошибка при входе. Проверьте данные.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-bold">Вход в систему</h1>
					<p className="text-muted-foreground">
						Введите ваши учетные данные для входа
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<CustomInput
						{...register("username")}
						label="Имя пользователя"
						type="text"
						autoComplete="username"
						required
						error={errors.username?.message}
					/>

					<CustomInput
						{...register("password")}
						label="Пароль"
						type="password"
						autoComplete="current-password"
						required
						error={errors.password?.message}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Вход..." : "Войти"}
					</Button>
				</form>
			</div>
		</div>
	);
}
