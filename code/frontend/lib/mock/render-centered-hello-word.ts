export type GreetingState = "loading" | "empty" | "error" | "ready";

export type GreetingResponse = {
  displayText: string;
};

export const greetingMock: GreetingResponse = {
  displayText: "Hello Word",
};
