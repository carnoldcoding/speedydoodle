import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import CommissionType from "./CommissionType";
import Confirmation from "./Confirmation";
import Details from "./Details";
import PageTwo from "./PageTwo";
import Modal from "./PageTwo/Modal";
import { roundCurrency } from "./pricing";
import type { QuoteFormData, UpdateQuoteForm } from "./types";
import { useMultiStepForm } from "./useMultiStepForm";

const INITIAL_DATA: QuoteFormData = {
  //All Forms
  type: "", //Radio Buttons
  firstName: "", //Text Field
  lastName: "", //Text Field
  email: "", //Text Field
  extraDetails: "",

  //Live Caricatures
  location: "", //Google API
  event: "", //Text Field
  headcount: "", //Text Field
  date: "", //Date Field
  startTime: "", //Time Field
  endTime: "", //Time Field

  //Calculated Fields
  distance: 0,
  totalDistance: 0,
  gasCost: 0,
  wage: 150,
  eventTime: 0,
  eventCost: 0,
  totalCost: 0,

  //Custom Caricatures
  personCount: 0, //Number Field (75 first, 75 second, 40 third, 50 each after that.)
  personCountPrice: 0,
  background: "", //Select Field (None - 0, Complex - 75, Simple - 50)
  textOption: "", //Select Field (None - 0, Standard - 25)
  textContent: "", //Text Field
  description: "",

  //Calculated Fields
  customCost: 150,

  //Logos and Illustrations
  other: [
    { type: "illustration", price: 500 },
    { type: "logo", price: 75 },
  ],
  otherSelection: "",
  otherPrice: "",

  //Description
  additionalInfo: "",
};

// The time field gives a Date. The server takes "HH:MM" on a 24-hour clock.
const formatTime = (time: Date | "") =>
  time instanceof Date
    ? `${String(time.getHours()).padStart(2, "0")}:${String(
        time.getMinutes()
      ).padStart(2, "0")}`
    : "";

// The fields the server accepts for each quote type. The server builds the
// email and calculates the price, so no email text and no price is sent.
const buildQuote = (formData: QuoteFormData) => {
  const quote = {
    type: formData.type,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    additionalInfo: formData.additionalInfo,
  };
  if (formData.type === "live") {
    return {
      ...quote,
      event: formData.event,
      headcount: formData.headcount,
      location: formData.location,
      date: formData.date,
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
    };
  }
  if (formData.type === "custom") {
    const includeText = Number(formData.textOption) === 25;
    return {
      ...quote,
      description: formData.description,
      background:
        Number(formData.background) === 75
          ? "complex"
          : Number(formData.background) === 50
            ? "simple"
            : "none",
      personCount: formData.personCount,
      includeText,
      ...(includeText ? { textContent: formData.textContent } : {}),
    };
  }
  return { ...quote, selection: formData.otherSelection };
};

const FIELD_LABELS: Record<string, string> = {
  type: "the commission type",
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  additionalInfo: "Additional Details",
  event: "Event",
  headcount: "Headcount Estimate",
  location: "Location",
  date: "Date",
  startTime: "Start Time",
  endTime: "End Time",
  description: "Caricature Request",
  background: "Background",
  personCount: "Number of People",
  includeText: "Text Display",
  textContent: "Text Content",
  selection: "the logo or illustration choice",
};

const submitQuote = async (formData: QuoteFormData) => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildQuote(formData)),
    });
  } catch {
    throw new Error(
      "We could not reach the server. Check your connection and try again."
    );
  }
  if (response.status === 201) return;
  if (response.status === 429) {
    throw new Error(
      "Too many requests were sent in a short time. Wait one minute, then try again."
    );
  }
  if (response.status === 400) {
    const problem: { field?: string; message?: string } = await response
      .json()
      .catch(() => ({}));
    const label = FIELD_LABELS[String(problem.field)];
    throw new Error(
      label
        ? `Check ${label}: ${problem.message} Use the back button to change it.`
        : "A field has a value that is not valid. Use the back button to check your entries."
    );
  }
  throw new Error(
    "Your request was not sent because of a server problem. Try again in a few minutes."
  );
};

// The radio groups, the selects and the date field are not native controls.
// Each one puts a hidden native control in the form, and that control does the
// `required` check. This is a second check on the form state, in case the
// hidden control does not stop the submit.
const isChoiceMissing = (step: number, data: QuoteFormData) => {
  if (step === 0) return data.type === "";
  if (step !== 1) return false;
  if (data.type === "live") {
    return data.date === "" || data.startTime === "" || data.endTime === "";
  }
  if (data.type === "custom") {
    return data.background === "" || data.textOption === "";
  }
  return data.otherSelection === "";
};

const PROGRESS_STEPS = ["type", "pricing", "details", "confirmation"];

const CONTROL_BUTTON =
  "h-[50px] min-w-[clamp(120px,15vw,135px)] cursor-pointer rounded-none px-[6px] py-px text-[length:clamp(1.25rem,3vw,1.5rem)] font-bold uppercase duration-200";

const ServicesForm = () => {
  const [data, setData] = useState(INITIAL_DATA);

  const update: UpdateQuoteForm = (fieldName, newValue) => {
    setData((prev) => {
      const updatedData: QuoteFormData = {
        ...prev,
        [fieldName]: newValue,
      };

      // Calculate eventTime and eventCost based on updatedData
      if (updatedData.startTime !== "" && updatedData.endTime !== "") {
        updatedData.eventTime =
          (updatedData.endTime.getTime() - updatedData.startTime.getTime()) /
          (1000 * 60 * 60);
        if (updatedData.startTime > updatedData.endTime) {
          updatedData.eventTime += 24;
        }
        updatedData.eventCost = roundCurrency(
          updatedData.wage * updatedData.eventTime
        );
      }

      //Calculate gasCost based on distance
      if (updatedData.distance !== 0) {
        const mpg = 27;
        const perGallon = 3.7;
        const rawDistance = updatedData.totalDistance;
        updatedData.gasCost = roundCurrency((rawDistance / mpg) * perGallon);
      }

      //Update total cost
      updatedData.totalCost = roundCurrency(
        updatedData.gasCost
          ? updatedData.gasCost + updatedData.eventCost
          : updatedData.eventCost
      );

      //Update person count price
      const personCount = Number(updatedData.personCount);
      updatedData.personCount = personCount;
      if (personCount) {
        // A count that matches no tier (a fraction or a negative number) has
        // no price. The total then shows as NaN until the count is corrected.
        let price = NaN;
        if (personCount === 1) {
          price = 75;
        } else if (personCount === 2) {
          price = 150;
        } else if (personCount === 3) {
          price = 190;
        } else if (personCount > 3) {
          price = 190 + (personCount - 3) * 50;
        }
        updatedData.personCountPrice = price;
      } else {
        updatedData.personCountPrice = 0;
      }

      //Update custom cost
      updatedData.customCost = roundCurrency(
        150 +
          updatedData.personCountPrice +
          Number(updatedData.background) +
          Number(updatedData.textOption)
      );

      return updatedData;
    });
  };

  const { current, next, back, step, isFirstStep, isLastStep } =
    useMultiStepForm([
      <CommissionType update={update} />,
      <PageTwo data={data} update={update} />,
      <Details update={update} />,
      <Confirmation data={data} />,
    ]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isChoiceMissing(current, data)) {
      e.currentTarget.reportValidity();
      return;
    }
    // Step 3 is the last step with input. It sends the quote to the server.
    if (current !== 2) {
      next();
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitQuote(data);
      next();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // The old site had the browser default line height, and Tailwind sets 1.5.
    <section className="relative flex justify-center gap-5 p-page pb-[200px] leading-[normal] text-white">
      <article className="relative w-[95dvw] max-w-content">
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center justify-center"
        >
          <ul className="flex w-[clamp(300px,60vw,1000px)] max-w-[1000px] list-none justify-evenly">
            {PROGRESS_STEPS.map((name, index) => {
              const active = current + 1 > index;
              return (
                <li
                  key={name}
                  data-testid="progress-step"
                  data-active={active ? "true" : undefined}
                  className={cn(
                    "relative flex size-[50px] items-center justify-center rounded-full bg-white",
                    active && "bg-primary"
                  )}
                >
                  <h3 className="absolute top-[-40px] left-1/2 -translate-x-1/2 text-[1.17em] font-bold whitespace-nowrap text-white uppercase mobile:hidden">
                    {name}
                  </h3>
                  <h1
                    className={cn(
                      "text-[2em] font-bold",
                      active ? "text-white" : "text-black"
                    )}
                  >
                    {index + 1}
                  </h1>
                </li>
              );
            })}
          </ul>
          {step}
          {submitError && (
            <p
              data-testid="submit-error"
              role="alert"
              className="mt-5 rounded-[10px] border-2 border-destructive px-4 py-3 leading-[1.4] text-white"
            >
              {submitError}
            </p>
          )}
          <article className="absolute bottom-[-100px] flex w-full justify-center gap-12">
            {!isFirstStep && !isLastStep && (
              <Button
                type="button"
                variant="ghost"
                data-testid="form-back"
                onClick={back}
                className={cn(
                  CONTROL_BUTTON,
                  "border-[3px] border-primary bg-transparent text-primary hover:bg-transparent hover:text-primary dark:hover:bg-transparent"
                )}
              >
                back
              </Button>
            )}
            {isLastStep ? (
              <Button
                asChild
                data-testid="form-home"
                className={cn(CONTROL_BUTTON, "text-white hover:bg-primary")}
              >
                <Link to="/homepage">home</Link>
              </Button>
            ) : (
              <Button
                data-testid="form-next"
                disabled={submitting}
                className={cn(
                  CONTROL_BUTTON,
                  "text-white hover:bg-primary disabled:opacity-100"
                )}
              >
                {current === 2 ? (submitting ? "sending" : "order") : "next"}
              </Button>
            )}
          </article>
        </form>
        <Modal />
      </article>
    </section>
  );
};

export default ServicesForm;
