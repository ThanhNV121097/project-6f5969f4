"use client";

import { useEffect, useState } from "react";
import styles from "./HelloWordScreen.module.css";

type GreetingState =
  | { status: "loading" }
  | { status: "ready"; displayText: string }
  | { status: "error"; message: string };

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export default function HelloWordScreen() {
  const [state, setState] = useState<GreetingState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadGreeting() {
      try {
        const response = await fetch(`${apiBase}/v1/greeting`, { signal: controller.signal });
        const data = await response.json();

        if (!response.ok || typeof data.displayText !== "string") {
          throw new Error("Greeting unavailable");
        }

        setState({ status: "ready", displayText: data.displayText });
      } catch {
        if (!controller.signal.aborted) {
          setState({ status: "error", message: "Greeting unavailable" });
        }
      }
    }

    loadGreeting();
    return () => controller.abort();
  }, []);

  return (
    <main className={styles.screen} aria-label="Greeting screen">
      {state.status === "loading" ? (
        <p className={styles.message}>Loading</p>
      ) : state.status === "error" ? (
        <p className={styles.message}>{state.message}</p>
      ) : (
        <p className={styles.message}>{state.displayText}</p>
      )}
    </main>
  );
}
