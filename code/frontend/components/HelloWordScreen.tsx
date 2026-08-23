"use client";

import { useSearchParams } from "next/navigation";
import styles from "./HelloWordScreen.module.css";
import { greetingMock } from "../lib/mock/render-centered-hello-word";

export default function HelloWordScreen() {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");

  let content = greetingMock.displayText;

  if (state === "loading") {
    content = "Loading";
  } else if (state === "empty") {
    content = "Greeting not found";
  } else if (state === "error") {
    content = "Service unavailable";
  }

  return (
    <main className={styles.screen} aria-label="Greeting screen">
      <p className={styles.message}>{content}</p>
    </main>
  );
}
