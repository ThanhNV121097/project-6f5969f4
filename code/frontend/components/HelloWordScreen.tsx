"use client";

import { useMemo, useState } from "react";
import styles from "./HelloWordScreen.module.css";
import { greetingMock } from "../lib/mock/render-centered-hello-word";

export type HelloWordScreenState = "ready" | "loading" | "empty" | "error";

export default function HelloWordScreen() {
  const [state] = useState<HelloWordScreenState>("ready");

  const content = useMemo(() => {
    if (state === "loading") {
      return "Loading";
    }

    if (state === "empty") {
      return "Greeting not found";
    }

    if (state === "error") {
      return "Service unavailable";
    }

    return greetingMock.displayText;
  }, [state]);

  return (
    <main className={styles.screen} aria-label="Greeting screen">
      <p className={styles.message}>{content}</p>
    </main>
  );
}
