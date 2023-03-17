// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: "screenOneTextEntered";
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {
    screenOneTextEntered: "NEXT";
  };
  eventsCausingServices: {};
  matchesStates: "screenOne" | "screenTwo";
  tags: never;
}
