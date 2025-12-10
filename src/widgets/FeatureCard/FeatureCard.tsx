"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import styles from "./FeatureCard.module.scss";

interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	href: string;
	buttonText: string;
}

export function FeatureCard({
	icon,
	title,
	description,
	href,
	buttonText,
}: FeatureCardProps) {
	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.iconWrapper}>{icon}</div>
				<h2 className={styles.title}>{title}</h2>
			</div>
			<p className={styles.description}>{description}</p>
			<Button asChild variant="outline" className={styles.button}>
				<Link href={href}>
					{buttonText}
					<ArrowRight className="ml-2 size-4" />
				</Link>
			</Button>
		</div>
	);
}

