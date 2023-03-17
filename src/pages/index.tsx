import { useMachine } from "@xstate/react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { createMachine, StateFrom } from "xstate";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const machine = createMachine({
  tsTypes: {} as import("./index.typegen").Typegen0,
  schema: { events: {} as { type: "NEXT" | "BACK" } },
  initial: "screenOne",
  states: {
    screenOne: { on: { NEXT: { target: "screenTwo" } } },
    screenTwo: { on: { BACK: { target: "screenOne" } } },
  },
});

const schema = z.object({
  screenOneText: z.string().min(1),
  screenTwoText: z.string().min(1),
});

type Schema = z.infer<typeof schema>;

export default function Home() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });
  const [state, send] = useMachine(machine);
  const currentScreen = getCurrentScreen(state);
  const formCurrentState = form.watch();

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

      <pre>{JSON.stringify(formCurrentState, null, 2)}</pre>
    </div>
  );
}

const ScreenOne = () => {
  const { register } = useFormContext<Schema>();

  return (
    <div style={{ fontWeight: "bold" }}>
      <div>ScreenOne</div>

      <input type="text" {...register("screenOneText")} />
    </div>
  );
};

const ScreenTwo = () => {
  const { register } = useFormContext<Schema>();

  return (
    <div style={{ fontWeight: "bold" }}>
      <div>ScreenTwo</div>

      <input type="text" {...register("screenTwoText")} />
    </div>
  );
};

const getCurrentScreen = (state: StateFrom<typeof machine>) => {
  if (state.matches("screenOne")) {
    return <ScreenOne />;
  }

  if (state.matches("screenTwo")) {
    return <ScreenTwo />;
  }
};
