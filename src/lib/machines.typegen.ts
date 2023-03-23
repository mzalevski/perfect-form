// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.after(500)#(machine).loadingForm": {
      type: "xstate.after(500)#(machine).loadingForm";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "loadForm" | "resetData" | "submitData";
    delays: never;
    guards: "isContactDataValid" | "isDataValid" | "isPersonalDataValid";
    services: never;
  };
  eventsCausingActions: {
    loadForm: "xstate.after(500)#(machine).loadingForm";
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
    | "loadingForm"
    | "personalDataScreen"
    | "successScreen"
    | "summaryScreen";
  tags: never;
}
