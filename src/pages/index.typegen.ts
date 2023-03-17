// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "resetData" | "submitData";
    delays: never;
    guards: "isContactDataValid" | "isDataValid" | "isPersonalDataValid";
    services: never;
  };
  eventsCausingActions: {
    resetData: "AGAIN";
    submitData: "SUBMIT";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isContactDataValid: "NEXT";
    isDataValid: "SUBMIT";
    isPersonalDataValid: "NEXT";
  };
  eventsCausingServices: {};
  matchesStates:
    | "contactDataScreen"
    | "personalDataScreen"
    | "successScreen"
    | "summaryScreen";
  tags: never;
}
