import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
	message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
	return <div className={styles.container}>Ошибка: {message}</div>;
}
