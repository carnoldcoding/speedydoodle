import type { FormEvent } from "react";
import { ComicButton } from "@/components/ComicButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePrices } from "@/components/ContentContext";
import { dollars, type Prices } from "@/lib/estimate";
import type { QuoteType } from "@/lib/gallery";
import { TIME_OPTIONS, type FieldKey, type Problems, type QuoteAnswers } from "@/lib/quote";
import { ChoiceGroup, controlProps, Field, PeopleStepper } from "./fields";
import { LocationField, type Place } from "./LocationField";

export type SetAnswer = <Key extends FieldKey>(key: Key, value: QuoteAnswers[Key]) => void;

interface AnswerStepProps {
  type: QuoteType;
  answers: QuoteAnswers;
  problems: Problems;
  place: Place;
  // The first day the date picker allows, as "YYYY-MM-DD". Empty until the page runs in the browser.
  today: string;
  set: SetAnswer;
  onTypeLocation: (text: string) => void;
  onChooseLocation: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const backgrounds = (prices: Prices) => [
  { value: "none" as const, label: "No background", cost: "No extra cost" },
  { value: "simple" as const, label: "Simple", cost: `Adds ${dollars(prices.backgroundSimple)}` },
  { value: "complex" as const, label: "Detailed", cost: `Adds ${dollars(prices.backgroundComplex)}` },
];

const wordChoices = (prices: Prices) => [
  { value: "no" as const, label: "No words", cost: "No extra cost" },
  { value: "yes" as const, label: "Yes, add words", cost: `Adds ${dollars(prices.words)}` },
];

const selections = (prices: Prices) => [
  { value: "logo" as const, label: "A logo", cost: `${dollars(prices.logoHourlyRate)} an hour` },
  { value: "illustration" as const, label: "An illustration", cost: dollars(prices.illustration) },
];

const DRAWING_HELP = "Who's in it, and what are they up to? You can email us the photos later.";
const NEED_HELP = "What's it for, and what should it show?";

// Step 2: the questions about the visitor, then the questions of the chosen kind of work.
export function AnswerStep({ type, answers, problems, place, today, set, onTypeLocation, onChooseLocation, onBack, onNext }: AnswerStepProps) {
  const prices = usePrices();

  function submit(event: FormEvent) {
    event.preventDefault();
    onNext();
  }

  // A one-line text field.
  const line = (
    name: "firstName" | "lastName" | "email" | "phone" | "event" | "headcount" | "textContent",
    label: string,
    more: { help?: string; maxLength: number; type?: string; autoComplete?: string; inputMode?: "email" | "numeric" },
  ) => {
    const { help, ...attributes } = more;
    return (
      <Field name={name} label={label} help={help} problem={problems[name]}>
        <Input type="text" {...attributes} {...controlProps(name, help, problems[name])} value={answers[name]} onChange={(event) => set(name, event.target.value)} />
      </Field>
    );
  };

  const time = (name: "startTime" | "endTime", label: string) => (
    <Field name={name} label={label} problem={problems[name]}>
      <select {...controlProps(name, undefined, problems[name])} value={answers[name]} onChange={(event) => set(name, event.target.value)}>
        <option value="">Choose a time</option>
        {TIME_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <form noValidate onSubmit={submit}>
      <div className="quote-pair">
        {line("firstName", "First name", { maxLength: 60, autoComplete: "given-name" })}
        {line("lastName", "Last name", { maxLength: 60, autoComplete: "family-name" })}
      </div>
      {line("email", "Email address", { help: "We'll send your quote here.", maxLength: 254, type: "email", autoComplete: "email", inputMode: "email" })}
      {line("phone", "Phone number (optional)", { help: "We only call if a detail of your event is unclear.", maxLength: 25, type: "tel", autoComplete: "tel" })}

      {type === "live" ? (
        <>
          {line("event", "What is the event?", { help: "For example: a wedding, a birthday, a company picnic.", maxLength: 100 })}
          {line("headcount", "About how many guests?", { maxLength: 6, inputMode: "numeric" })}
          <LocationField value={answers.location} place={place} problem={problems.location} onType={onTypeLocation} onChoose={onChooseLocation} />
          <Field name="date" label="What day?" problem={problems.date}>
            <Input type="date" min={today || undefined} {...controlProps("date", undefined, problems.date)} value={answers.date} onChange={(event) => set("date", event.target.value)} />
          </Field>
          <div className="quote-pair">
            {time("startTime", "Start time")}
            {time("endTime", "End time")}
          </div>
        </>
      ) : null}

      {type === "custom" ? (
        <>
          <PeopleStepper value={answers.people} onChange={(people) => set("people", people)} problem={problems.people} />
          <ChoiceGroup name="background" label="Do you want a background?" options={backgrounds(prices)} value={answers.background} onChange={(value) => set("background", value)} problem={problems.background} />
          <ChoiceGroup name="words" label="Do you want words on the drawing?" options={wordChoices(prices)} value={answers.words} onChange={(value) => set("words", value)} problem={problems.words} />
          {answers.words === "yes" ? line("textContent", "What should the words say?", { maxLength: 200 }) : null}
          <Field name="description" label="Describe the drawing" help={DRAWING_HELP} problem={problems.description}>
            <Textarea
              maxLength={2000}
              {...controlProps("description", DRAWING_HELP, problems.description)}
              value={answers.description}
              onChange={(event) => set("description", event.target.value)}
            />
          </Field>
        </>
      ) : null}

      {type === "lni" ? (
        <>
          <ChoiceGroup name="selection" label="Which one do you need?" options={selections(prices)} value={answers.selection} onChange={(value) => set("selection", value)} problem={problems.selection} />
          <Field name="lniDescription" label="Describe what you need" help={NEED_HELP} problem={problems.lniDescription}>
            <Textarea
              maxLength={2000}
              {...controlProps("lniDescription", NEED_HELP, problems.lniDescription)}
              value={answers.lniDescription}
              onChange={(event) => set("lniDescription", event.target.value)}
            />
          </Field>
        </>
      ) : null}

      <div className="quote-actions">
        <ComicButton ghost size="large" data-testid="form-back" onClick={onBack}>
          Back
        </ComicButton>
        <ComicButton size="large" type="submit" data-testid="form-next">
          Next
        </ComicButton>
      </div>
    </form>
  );
}
