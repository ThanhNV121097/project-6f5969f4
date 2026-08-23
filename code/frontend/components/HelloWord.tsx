'use client';

import { useEffect, useState } from 'react';

import styles from './HelloWord.module.css';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export function HelloWord() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${apiBase}/v1/greeting`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load greeting');
        }

        return response.json() as Promise<{ displayText: string }>;
      })
      .then((data) => setDisplayText(data.displayText))
      .catch(() => setDisplayText(''));

    return () => controller.abort();
  }, []);

  return (
    <section className={styles.shell} aria-label="Greeting">
      <p className={styles.text}>{displayText}</p>
    </section>
  );
}
