"use client";

import Link from "next/link";
import {
	BookOpen,
	GraduationCap,
	ArrowRight,
	Sparkles,
	Users,
	TrendingUp,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Navbar } from "@/widgets/Navbar/Navbar";
import { FeatureCard } from "@/widgets/FeatureCard/FeatureCard";
import { routes } from "@/core/config/routes";
import styles from "./page.module.scss";

export default function Home() {
	return (
		<>
			<Navbar />
			<div className={styles.wrapper}>
				<section className={styles.hero}>
					<div className={styles.heroBackground} />
					<div className={styles.heroContent}>
						<div className={styles.badge}>
							<Sparkles className="size-4" />
							<span>Добро пожаловать в Skill Lab</span>
						</div>
						<h1 className={styles.title}>
							Изучайте и создавайте
							<br />
							<span className={styles.titleAccent}>онлайн курсы</span>
						</h1>
						<p className={styles.description}>
							Платформа для создания и изучения образовательных курсов и модулей.
							Развивайте свои навыки вместе с нами.
						</p>
						<div className={styles.actions}>
							<Button asChild size="lg" className={styles.primaryButton}>
								<Link href={routes.courses()}>
									Изучать курсы
									<ArrowRight className="size-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg">
								<Link href={routes.modules()}>
									Просмотреть модули
									<ArrowRight className="size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				<section className={styles.stats}>
					<div className={styles.statsContainer}>
						<div className={styles.statCard}>
							<div className={styles.statIcon}>
								<BookOpen className="size-6" />
							</div>
							<div className={styles.statContent}>
								<div className={styles.statValue}>Курсы</div>
								<div className={styles.statLabel}>Доступно для изучения</div>
							</div>
						</div>
						<div className={styles.statCard}>
							<div className={styles.statIcon}>
								<GraduationCap className="size-6" />
							</div>
							<div className={styles.statContent}>
								<div className={styles.statValue}>Модули</div>
								<div className={styles.statLabel}>Образовательных материалов</div>
							</div>
						</div>
						<div className={styles.statCard}>
							<div className={styles.statIcon}>
								<Users className="size-6" />
							</div>
							<div className={styles.statContent}>
								<div className={styles.statValue}>Пользователи</div>
								<div className={styles.statLabel}>Активных студентов</div>
							</div>
						</div>
					</div>
				</section>

				<section className={styles.features}>
					<div className={styles.featuresContainer}>
						<div className={styles.featuresHeader}>
							<h2 className={styles.featuresTitle}>Возможности платформы</h2>
							<p className={styles.featuresSubtitle}>
								Все что нужно для эффективного обучения
							</p>
						</div>
						<div className={styles.featuresGrid}>
							<FeatureCard
								icon={<BookOpen />}
								title="Курсы"
								description="Изучайте разнообразные курсы по программированию, дизайну и другим направлениям. Каждый курс содержит модули и тесты для проверки знаний."
								href={routes.courses()}
								buttonText="Перейти к курсам"
							/>
							<FeatureCard
								icon={<GraduationCap />}
								title="Модули"
								description="Просматривайте и создавайте образовательные модули. Модули можно использовать в курсах для структурирования материала."
								href={routes.modules()}
								buttonText="Перейти к модулям"
							/>
						</div>
					</div>
				</section>

				<section className={styles.benefits}>
					<div className={styles.benefitsContainer}>
						<div className={styles.benefitsContent}>
							<h2 className={styles.benefitsTitle}>
								Почему выбирают Skill Lab?
							</h2>
							<div className={styles.benefitsList}>
								<div className={styles.benefitItem}>
									<CheckCircle2 className="size-5" />
									<span>Интерактивные курсы с практическими заданиями</span>
								</div>
								<div className={styles.benefitItem}>
									<CheckCircle2 className="size-5" />
									<span>Гибкая система модулей для структурирования обучения</span>
								</div>
								<div className={styles.benefitItem}>
									<CheckCircle2 className="size-5" />
									<span>Тесты и проверка знаний в каждом курсе</span>
								</div>
								<div className={styles.benefitItem}>
									<CheckCircle2 className="size-5" />
									<span>Удобный интерфейс для преподавателей и студентов</span>
								</div>
							</div>
						</div>
						<div className={styles.benefitsVisual}>
							<div className={styles.visualCard}>
								<TrendingUp className="size-12" />
								<p>Постоянное развитие</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
