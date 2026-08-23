import styles from './HelloWord.module.css';
import { greetingMock } from '../lib/mock/persist-and-serve-text';

export function HelloWord() {
  return (
    <section className={styles.shell} aria-label="Greeting">
      <p className={styles.text}>{greetingMock.displayText}</p>
    </section>
  );
}
