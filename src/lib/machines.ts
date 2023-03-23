import { createMachine } from "xstate";

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOkwHt8AXLKgEXRoGVMAnMMfAYgDkBRABoAVANoAGALqJQAB3KxcVXJWkgAHogDMAFgBsJAOwAmXdqNGAHEe0BGGwFZNmgDQgAnonsXtJB-ZsWgdoAnHrBBgC+Ea5oWHiEpDJgrLCU6AA2DMxsHNwAQgCCAMIA0uJSSCByCkoqlRoItsEkYlbaBsG6mgbejq4eCD02JJr25rq6rV42ukZRMRg4BMQkSSlpmYzoLOycvIKikqrVisr4qg0WBgYk9mNjZmLBjh39nt6+dwFBobrh8yBYksEiRYABXVAYVhuHa5LiFUrlY7yU51UANZ7DTp2ey2AxmbQWN6DCzDUbjSYWaa6AFA+IrcGQ9DQ2F7JgAVTyAFkAJKHCqyFG1c71RA2IzikiEv72XQWMTaRWK4my4ZGMQ2RWkkzBMRGTS0xb00jgzCYOCwVncAoAcQKPJ4SMqJ2FF0QpKxTkcT2MYlGRPciGC5haquCz1CrSeUWiIHw5AgcFUdOWRGRNTOboQ9huml1mhm4W6et09mJ7U0hnM4buxgs4YsBtjKZBFGotCy2xynHTqJF6LFYnsI3zhYMxZMZcDgwchnsCosXQMNlGpcNcVTq2SqXwGU7Vt7rtFCFMw9a2hzBkmYg6ugMxOXw4M8+l3RXsvs6+BDIhUJh3f7KohUzY8bBvYZdBsYMC2CTQJW8bQH1nZ8FyXd8Ji-Y1QTBM0LQPZ1gLRdQxTzSs7z0bQdAMJ4bynAZHznVC31XT8YyAA */
  tsTypes: {} as import("./machines.typegen").Typegen0,
  predictableActionArguments: true,
  schema: {
    events: {} as {
      type:
        | "NEXT"
        | "BACK"
        | "SUBMIT"
        | "AGAIN"
        | "LOAD_CONTACT_DATA_SCREEN"
        | "LOAD_PERSONAL_DATA_SCREEN"
        | "LOAD_SUMMARY_SCREEN"
        | "LOAD_SUCCESS_SCREEN";
    },
  },
  initial: "loadingForm",
  states: {
    loadingForm: {
      after: { 500: { actions: ["loadForm"] } },
      on: {
        LOAD_CONTACT_DATA_SCREEN: { target: "contactDataScreen" },
        LOAD_PERSONAL_DATA_SCREEN: { target: "personalDataScreen" },
        LOAD_SUMMARY_SCREEN: { target: "summaryScreen" },
        LOAD_SUCCESS_SCREEN: { target: "successScreen" },
      },
    },
    contactDataScreen: {
      on: {
        NEXT: {
          cond: "isContactDataValid",
          target: "personalDataScreen",
        },
      },
    },
    personalDataScreen: {
      on: {
        BACK: {
          target: "contactDataScreen",
        },
        NEXT: {
          cond: "isPersonalDataValid",
          target: "summaryScreen",
        },
      },
    },
    summaryScreen: {
      on: {
        BACK: {
          target: "personalDataScreen",
        },
        SUBMIT: {
          cond: "isDataValid",
          actions: ["submitData"],
          target: "successScreen",
        },
      },
    },
    successScreen: {
      on: {
        AGAIN: {
          target: "contactDataScreen",
          actions: "resetData",
        },
      },
    },
  },
});
