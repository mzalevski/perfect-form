/* eslint-disable react/display-name */
import { useMachine } from "@xstate/react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { StateFrom } from "xstate";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { memo, useEffect } from "react";
import { BrowserOnly } from "~/components/BrowserOnly";
import { BarLoader } from "react-spinners";
import { machine } from "~/lib/machines";

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
