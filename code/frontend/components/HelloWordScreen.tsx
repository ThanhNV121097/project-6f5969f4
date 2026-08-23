"use client";

import styles from "./HelloWordScreen.module.css";
import { greetingMock } from "../lib/mock/render-centered-hello-word";

export default function HelloWordScreen() {
  return (
    <main className={styles.screen} aria-label="Greeting screen">
      <p className={styles.message}>{greetingMock.displayText}</p>
    </main>
  );
}
