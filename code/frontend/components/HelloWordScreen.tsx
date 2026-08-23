"use client";

import styles from "./HelloWordScreen.module.css";
import { greetingMock } from "../lib/mock/render-centered-hello-word";

function GreetingMessage() {
  if (greetingMock.status === "error") {
    return <p className={styles.message}>{greetingMock.error.message}</p>;
  }

  return <p className={styles.message}>{greetingMock.displayText}</p>;
}

export default function HelloWordScreen() {
  return (
    <main className={styles.screen} aria-label="Greeting screen">
      <GreetingMessage />
    </main>
  );
}
