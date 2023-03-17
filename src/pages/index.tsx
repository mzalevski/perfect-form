import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import type { StateFrom } from "xstate";

const ScreenOne = () => {
  return (
    <div style={{ fontWeight: "bold" }}>
      <div>ScreenOne</div>

      <div>
        <input type="text" placeholder="ScreenOneText" />
      </div>
    </div>
  );
};

const ScreenTwo = () => {
  return (
    <div style={{ fontWeight: "bold" }}>
      <div>ScreenTwo</div>

      <div>
        <input type="text" placeholder="ScreenTwoText" />
      </div>
    </div>
  );
};

const machine = createMachine({
  tsTypes: {} as import("./index.typegen").Typegen0,
  schema: { events: {} as { type: "NEXT" | "BACK" } },
  initial: "screenOne",
  states: {
    screenOne: { on: { NEXT: "screenTwo" } },
    screenTwo: { on: { BACK: "screenOne" } },
  },
});

const getCurrentScreen = (state: StateFrom<typeof machine>) => {
  if (state.matches("screenOne")) {
    return <ScreenOne />;
  }

  if (state.matches("screenTwo")) {
    return <ScreenTwo />;
  }
};

export default function Home() {
  const [state, send] = useMachine(machine);

  const currentScreen = getCurrentScreen(state);

  return (
    <div>
      {currentScreen}

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
    </div>
  );
}
