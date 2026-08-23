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
      status: "loading";
    }
  | {
      status: "empty";
    }
  | {
      status: "error";
      error: GreetingError;
    };

export const greetingMock: GreetingResponse = {
  status: "ready",
  displayText: "Hello Word",
};
