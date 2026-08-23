'use client';

import { useEffect, useState } from 'react';

import styles from './HelloWord.module.css';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '/api';

type GreetingState =
  | { status: 'loading' }
  | { status: 'ready'; displayText: string }
  | { status: 'error' };

export function HelloWord() {
  const [state, setState] = useState<GreetingState>({ status: 'loading' });

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

        return response.json() as Promise<{ displayText?: unknown }>;
      })
      .then((data) => {
        if (typeof data.displayText !== 'string' || data.displayText.length === 0) {
          throw new Error('Failed to load greeting');
        }

        setState({ status: 'ready', displayText: data.displayText });
      })
      .catch(() => setState({ status: 'error' }));

    return () => controller.abort();
  }, []);

  return (
    <section className={styles.shell} aria-label="Greeting">
      {state.status === 'ready' ? (
        <p className={styles.text}>{state.displayText}</p>
      ) : state.status === 'error' ? (
        <p className={styles.error}>Unable to load greeting</p>
      ) : null}
    </section>
  );
}
