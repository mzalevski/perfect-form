/* eslint-disable react/display-name */
import { useMachine } from "@xstate/react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { createMachine, StateFrom } from "xstate";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { memo, useEffect } from "react";
import { BrowserOnly } from "./BrowserOnly";
import { BarLoader } from "react-spinners";

const contactDataSchema = z.object({
  phone: z.string().length(9),
  email: z.string().email(),
});

const personalDataSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

const schema = z.object({
  contactData: contactDataSchema,
  personalData: personalDataSchema,
});

type Schema = z.infer<typeof schema>;

const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOkwHt8AXLKgEXRoGVMAnMMfAYgDkBRABoAVANoAGALqJQAB3KxcVXJWkgAHogDMAFgBsJAOwAmXdqNGAHEe0BGGwFZNmgDQgAnonsXtJB-ZsWgdoAnHrBBgC+Ea5oWHiEpDJgrLCU6AA2DMxsHNwAQgCCAMIA0uJSSCByCkoqlRoItsEkYlbaBsG6mgbejq4eCD02JJr25rq6rV42ukZRMRg4BMQkSSlpmYzoLOycvIKikqrVisr4qg0WBgYk9mNjZmLBjh39nt6+dwFBobrh8yBYksEiRYABXVAYVhuHa5LiFUrlY7yU51UANZ7DTp2ey2AxmbQWN6DCzDUbjSYWaa6AFA+IrcGQ9DQ2F7JgAVTyAFkAJKHCqyFG1c71RA2IzikiEv72XQWMTaRWK4my4ZGMQ2RWkkzBMRGTS0xb00jgzCYOCwVncAoAcQKPJ4SMqJ2FF0QpKxTkcT2MYlGRPciGC5haquCz1CrSeUWiIHw5AgcFUdOWRGRNTOboQ9huml1mhm4W6et09mJ7U0hnM4buxgs4YsBtjKZBFGotCy2xynHTqJF6LFYnsI3zhYMxZMZcDgwchnsCosXQMNlGpcNcVTq2SqXwGU7Vt7rtFCFMw9a2hzBkmYg6ugMxOXw4M8+l3RXsvs6+BDIhUJh3f7KohUzY8bBvYZdBsYMC2CTQJW8bQH1nZ8FyXd8Ji-Y1QTBM0LQPZ1gLRdQxTzSs7z0bQdAMJ4bynAZHznVC31XT8YyAA */
  tsTypes: {} as import("./index.typegen").Typegen0,
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

export default function Home() {
  return (
    <BrowserOnly>
      <Form />
    </BrowserOnly>
  );
}

const Form = memo(() => {
  console.log("Form render");
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: JSON.parse(localStorage.getItem("form-data") ?? "{}"),
  });

  const formState = form.watch();

  useEffect(() => {
    localStorage.setItem("form-data", JSON.stringify(formState));
  }, [formState]);

  const [state, send] = useMachine(machine, {
    guards: {
      isContactDataValid: () => {
        const { success } = contactDataSchema.safeParse(formState.contactData);

        return success;
      },
      isPersonalDataValid: () => {
        const { success } = personalDataSchema.safeParse(
          formState.personalData
        );

        return success;
      },
      isDataValid: () => {
        const { success } = schema.safeParse(formState);

        return success;
      },
    },
    actions: {
      loadForm: () => {
        const currentScreen = localStorage.getItem("current-screen");

        if (currentScreen === "personalDataScreen") {
          send({ type: "LOAD_PERSONAL_DATA_SCREEN" });
          return;
        }

        if (currentScreen === "summaryScreen") {
          send({ type: "LOAD_SUMMARY_SCREEN" });
          return;
        }

        if (currentScreen === "successScreen") {
          console.log("xxx aaa", currentScreen);
          send({ type: "LOAD_SUCCESS_SCREEN" });
          send({ type: "AGAIN" });
          return;
        }

        send({ type: "LOAD_CONTACT_DATA_SCREEN" });
      },
      submitData: form.handleSubmit((data) => {
        console.log({ ...data.contactData, ...data.personalData });
      }),
      resetData: () => {
        localStorage.removeItem("form-data");
        form.reset({}, { keepDefaultValues: false });
      },
    },
  });

  useEffect(() => {
    const screen = state.value.toString();

    if (screen === "loadingForm") return;

    localStorage.setItem("current-screen", screen);
  }, [state.value]);

  const currentScreen = getCurrentScreen(state);

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <FormProvider {...form}>
        <div style={{ height: "120px" }}>{currentScreen}</div>
      </FormProvider>

      <br />

      <div>
        <button
          disabled={!state.can("BACK")}
          onClick={() => {
            send("BACK");
          }}
        >
          BACK
        </button>

        <button
          disabled={!state.can("NEXT")}
          onClick={() => {
            send("NEXT");
          }}
        >
          NEXT
        </button>

        <button
          disabled={!state.can("SUBMIT")}
          onClick={() => {
            send("SUBMIT");
          }}
        >
          SUBMIT
        </button>
        <button
          disabled={!state.can("AGAIN")}
          onClick={() => {
            send("AGAIN");
          }}
        >
          AGAIN
        </button>
      </div>
    </div>
  );
});

const ContactDataScreen = memo(() => {
  console.log("ContactDataScreen render");
  const {
    register,
    formState: { errors },
  } = useFormContext<Schema>();

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Contact Data</div>

      <br />

      <input
        {...register("contactData.phone")}
        autoFocus
        placeholder="phone"
        maxLength={9}
      />

      {errors.contactData?.phone && (
        <div style={{ color: "red", fontSize: 12 }}>
          {errors.contactData.phone.message}
        </div>
      )}

      <br />

      <input {...register("contactData.email")} placeholder="email" />

      {errors.contactData?.email && (
        <div style={{ color: "red", fontSize: 12 }}>
          {errors.contactData.email.message}
        </div>
      )}
    </div>
  );
});

const PersonalDataScreen = memo(() => {
  console.log("PersonalDataScreen render");
  const {
    register,
    formState: { errors },
  } = useFormContext<Schema>();

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Personal Data</div>

      <br />

      <input
        {...register("personalData.firstName")}
        autoFocus
        placeholder="firstName"
      />

      {errors.personalData?.firstName && (
        <div style={{ color: "red", fontSize: 12 }}>
          {errors.personalData.firstName.message}
        </div>
      )}

      <br />

      <input {...register("personalData.lastName")} placeholder="lastName" />

      {errors.personalData?.lastName && (
        <div style={{ color: "red", fontSize: 12 }}>
          {errors.personalData.lastName.message}
        </div>
      )}
    </div>
  );
});

const SummaryScreen = memo(() => {
  console.log("SummaryScreen render");
  const { watch } = useFormContext<Schema>();

  const formState = watch();

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Summary</div>

      <div>
        <div>Contact Data</div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {Object.entries(formState.contactData).map(([key, value]) => {
            return (
              <div key={key}>
                {key}: {value}
              </div>
            );
          })}
        </div>
      </div>

      <br />

      <div>
        <div>Personal Data</div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {Object.entries(formState.personalData).map(([key, value]) => {
            return (
              <div key={key}>
                {key}: {value}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

const SuccessScreen = memo(() => {
  console.log("SuccessScreen render");

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Success</div>
    </div>
  );
});

const LoadingScreen = memo(() => {
  console.log("LoadingScreen render");

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <BarLoader />
    </div>
  );
});

const getCurrentScreen = (state: StateFrom<typeof machine>) => {
  if (state.matches("loadingForm")) {
    return <LoadingScreen />;
  }

  if (state.matches("contactDataScreen")) {
    return <ContactDataScreen />;
  }

  if (state.matches("personalDataScreen")) {
    return <PersonalDataScreen />;
  }

  if (state.matches("summaryScreen")) {
    return <SummaryScreen />;
  }

  if (state.matches("successScreen")) {
    return <SuccessScreen />;
  }
};
