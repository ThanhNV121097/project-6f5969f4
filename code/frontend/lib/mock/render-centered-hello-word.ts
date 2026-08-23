export type GreetingError = {
  code: string;
  message: string;
};

export type GreetingResponse =
  | {
      status: "ready";
      displayText: string;
    }
  | {
      status: "error";
      error: GreetingError;
    };

export const greetingMock: GreetingResponse = {
  status: "error",
  error: {
    code: "service_unavailable",
    message: "Service unavailable",
  },
};
