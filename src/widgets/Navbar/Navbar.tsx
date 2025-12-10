"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, GraduationCap, User, LogOut, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useUserStore } from "@/entities/user/useUserStore";
import { routes } from "@/core/config/routes";
import { cn } from "@/shared/lib/utils";
import { UserRole } from "@/shared/types/enums";

export function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const { user, fetchUser, isAuthenticated, logout } = useUserStore();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const handleLogout = () => {
		logout();
		router.push(routes.login());
	};

	const navItems = [
		{
			href: routes.home(),
			label: "Главная",
			icon: null,
		},
		{
			href: routes.courses(),
			label: "Курсы",
			icon: BookOpen,
		},
		{
			href: routes.modules(),
			label: "Модули",
			icon: GraduationCap,
		},
	];

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link href={routes.home()} className="flex items-center space-x-2">
					<GraduationCap className="size-6" />
					<span className="text-xl font-bold">Skill Lab</span>
				</Link>

				<div className="hidden md:flex items-center space-x-6">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
									isActive ? "text-foreground" : "text-muted-foreground",
								)}
							>
								{Icon && <Icon className="size-4" />}
								<span>{item.label}</span>
							</Link>
						);
					})}
				</div>

				<div className="flex items-center space-x-4">
					{isAuthenticated && user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative size-8 rounded-full"
								>
									<User className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.username || "Пользователь"}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link
										href={routes.profile()}
										className="flex items-center space-x-2 cursor-pointer"
									>
										<User className="size-4" />
										<span>Профиль</span>
									</Link>
								</DropdownMenuItem>
								{user?.role === UserRole.ADMIN && (
									<DropdownMenuItem asChild>
										<Link
											href={routes.users()}
											className="flex items-center space-x-2 cursor-pointer"
										>
											<Users className="size-4" />
											<span>Пользователи</span>
										</Link>
									</DropdownMenuItem>
								)}

								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleLogout}
									className="cursor-pointer text-destructive focus:text-destructive"
								>
									<LogOut className="size-4 mr-2" />
									<span>Выйти</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild variant="outline" size="sm">
							<Link href={routes.login()}>Войти</Link>
						</Button>
					)}
				</div>
			</div>
		</nav>
	);
}
