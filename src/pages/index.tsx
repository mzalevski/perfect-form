import { useMachine } from "@xstate/react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { createMachine, StateFrom } from "xstate";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { pick } from "radash";

const contactDataSchema = {
  phone: z.string().length(9),
  email: z.string().email(),
};

const personalDataSchema = {
  firstName: z.string().min(2),
  lastName: z.string().min(2),
};

const schema = z.object({
  ...contactDataSchema,
  ...personalDataSchema,
});

type Schema = z.infer<typeof schema>;

const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOkwHt8AXLKgEXRoGVMAnMMfAYgDkBRABoAVANoAGALqJQAB3KxcVXJWkgAHogDMAFgBsJAOwAmXdqNGAHEe0BGGwFZNmgDQgAnonsXtJB-ZsWgdoAnHrBBgC+Ea5oWHiEpDJgrLCU6AA2DMxsHNwAQgCCAMIA0uJSSCByCkoqlRoItsEkYlbaBsG6mgbejq4eCD02JJr25rq6rV42ukZRMRg4BMQkSSlpmYzoLOycvIKikqrVisr4qg0WBgYk9mNjZmLBjh39nt6+dwFBobrh8yBYksEiRYABXVAYVhuHa5LiFUrlY7yU51UANZ7DTp2ey2AxmbQWN6DCzDUbjSYWaa6AFA+IrcGQ9DQ2F7JgAVTyAFkAJKHCqyFG1c71RA2IzikiEv72XQWMTaRWK4my4ZGMQ2RWkkzBMRGTS0xb00jgzCYOCwVncAoAcQKPJ4SMqJ2FF0QpKxTkcT2MYlGRPciGC5haquCz1CrSeUWiIHw5AgcFUdOWRGRNTOboQ9huml1mhm4W6et09mJ7U0hnM4buxgs4YsBtjKZBFGotCy2xynHTqJF6LFYnsI3zhYMxZMZcDgwchnsCosXQMNlGpcNcVTq2SqXwGU7Vt7rtFCFMw9a2hzBkmYg6ugMxOXw4M8+l3RXsvs6+BDIhUJh3f7KohUzY8bBvYZdBsYMC2CTQJW8bQH1nZ8FyXd8Ji-Y1QTBM0LQPZ1gLRdQxTzSs7z0bQdAMJ4bynAZHznVC31XT8YyAA */
  tsTypes: {} as import("./index.typegen").Typegen0,
  predictableActionArguments: true,
  schema: { events: {} as { type: "NEXT" | "BACK" | "SUBMIT" | "AGAIN" } },
  initial: "contactDataScreen",
  states: {
    contactDataScreen: {
      on: {
        NEXT: {
          target: "personalDataScreen",
          cond: "isContactDataValid",
        },
      },
    },
    personalDataScreen: {
      on: {
        BACK: {
          target: "contactDataScreen",
        },
        NEXT: {
          target: "summaryScreen",
          cond: "isPersonalDataValid",
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
  // console.log("Home render");
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });
  const formState = form.watch();
  const [state, send] = useMachine(machine, {
    guards: {
      isContactDataValid: () => {
        const { success } = z
          .object(contactDataSchema)
          .safeParse(pick(formState, ["phone", "email"]));

        return success;
      },
      isPersonalDataValid: () => {
        const { success } = z
          .object(personalDataSchema)
          .safeParse(pick(formState, ["firstName", "lastName"]));

        return success;
      },
      isDataValid: () => {
        const { success } = schema.safeParse(formState);

        return success;
      },
    },
    actions: {
      submitData: form.handleSubmit((data) => {
        console.log(data);
      }),
      resetData: () => {
        form.reset();
      },
    },
  });

  const currentScreen = getCurrentScreen(state);

  return (
    <div>
      <FormProvider {...form}>{currentScreen}</FormProvider>

      <br />

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
  );
}

const ContactDataScreen = () => {
  // console.log("ContactDataScreen render");
  const {
    register,
    formState: { errors },
  } = useFormContext<Schema>();

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Contact Data</div>

      <input
        {...register("phone")}
        autoFocus
        placeholder="phone"
        maxLength={9}
      />

      {errors.phone && (
        <div style={{ color: "red", fontSize: 12 }}>{errors.phone.message}</div>
      )}

      <input {...register("email")} placeholder="email" />

      {errors.email && (
        <div style={{ color: "red", fontSize: 12 }}>{errors.email.message}</div>
      )}
    </div>
  );
};

const PersonalDataScreen = () => {
  // console.log("PersonalDataScreen render");
  const {
    register,
    formState: { errors },
  } = useFormContext<Schema>();

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Personal Data</div>

      <input {...register("firstName")} autoFocus placeholder="firstName" />

      {errors.firstName && (
        <div style={{ color: "red", fontSize: 12 }}>
          {errors.firstName.message}
        </div>
      )}

      <input {...register("lastName")} placeholder="lastName" />

      {errors.lastName && (
        <div style={{ color: "red", fontSize: 12 }}>
          {errors.lastName.message}
        </div>
      )}
    </div>
  );
};

const SummaryScreen = () => {
  // console.log("SummaryScreen render");
  const { watch } = useFormContext<Schema>();

  const formState = watch();

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Summary</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {Object.entries(formState).map(([key, value]) => {
          return (
            <div key={key}>
              {key}: {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SuccessScreen = () => {
  // console.log("SuccessScreen render");

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Success</div>
    </div>
  );
};

const getCurrentScreen = (state: StateFrom<typeof machine>) => {
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
