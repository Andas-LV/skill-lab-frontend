import styles from "./LoadingState.module.scss";

interface LoadingStateProps {
	message?: string;
}

export function LoadingState({ message = "Загрузка..." }: LoadingStateProps) {
	return (
		<div className={styles.container}>
			{message}
		</div>
	);
}

