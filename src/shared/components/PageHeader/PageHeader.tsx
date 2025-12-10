import { ReactNode } from "react";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
	title: string;
	description?: string;
	action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div>
					<h1 className={styles.title}>{title}</h1>
					{description && <p className={styles.description}>{description}</p>}
				</div>
				{action && <div className={styles.action}>{action}</div>}
			</div>
		</div>
	);
}

