import styles from './HelloWord.module.css';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export async function HelloWord() {
  const response = await fetch(`${apiBase}/v1/greeting`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load greeting');
  }

  const data: { displayText: string } = await response.json();

  return (
    <section className={styles.shell} aria-label="Greeting">
      <p className={styles.text}>{data.displayText}</p>
    </section>
  );
}
