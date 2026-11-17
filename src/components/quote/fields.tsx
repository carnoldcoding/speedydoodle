import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MAX_PEOPLE, type FieldKey } from "@/lib/quote";

// The id of the control of a field. The form uses it to move to a field with a problem.
export const fieldId = (name: FieldKey) => `quote-${name}`;

// The ids of the texts that describe a control: its small text and its problem.
function describedBy(name: FieldKey, help: unknown, problem: unknown) {
  const ids = [help ? `${fieldId(name)}-help` : "", problem ? `${fieldId(name)}-problem` : ""].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

// The attributes that each text field, text area, and list has in common.
export function controlProps(name: FieldKey, help?: string, problem?: string) {
  return {
    id: fieldId(name),
    name,
    className: "quote-control",
    "aria-invalid": problem ? true : undefined,
    "aria-describedby": describedBy(name, help, problem),
  };
}

interface FieldProps {
  name: FieldKey;
  label: string;
  help?: string;
  problem?: string;
  children: ReactNode;
}

export function Problem({ name, problem }: { name: FieldKey; problem?: string }) {
  if (!problem) return null;
  return (
    <p id={`${fieldId(name)}-problem`} role="alert" data-testid={`problem-${name}`} className="quote-problem">
      {problem}
    </p>
  );
}

// A question: the label above, the control, and the problem under it as a sentence.
export function Field({ name, label, help, problem, children }: FieldProps) {
  return (
    <div className="quote-field">
      <div className="quote-label-block">
        <Label htmlFor={fieldId(name)} className="quote-label">
          {label}
        </Label>
        {help ? (
          <p id={`${fieldId(name)}-help`} className="quote-help">
            {help}
          </p>
        ) : null}
      </div>
      {children}
      <Problem name={name} problem={problem} />
    </div>
  );
}

interface ChoiceGroupProps<Value extends string> {
  name: "background" | "words" | "selection";
  label: string;
  options: { value: Value; label: string; cost: string }[];
  value: Value | "";
  onChange: (value: Value) => void;
  problem?: string;
}

// A question with two or three answers. Each answer is a large button that shows its cost.
export function ChoiceGroup<Value extends string>({ name, label, options, value, onChange, problem }: ChoiceGroupProps<Value>) {
  const labelId = `${fieldId(name)}-label`;
  return (
    <div className="quote-field">
      <p id={labelId} className="quote-label quote-label-block">
        {label}
      </p>
      <RadioGroup
        id={fieldId(name)}
        name={name}
        value={value}
        onValueChange={(next) => {
          const chosen = options.find((option) => option.value === next);
          if (chosen) onChange(chosen.value);
        }}
        aria-labelledby={labelId}
        aria-invalid={problem ? true : undefined}
        aria-describedby={describedBy(name, false, problem)}
        className="quote-options"
      >
        {options.map((option) => {
          const faceId = `${fieldId(name)}-${option.value}`;
          return (
            <div key={option.value} className="quote-option">
              <RadioGroupItem value={option.value} aria-labelledby={faceId} data-testid={`option-${name}-${option.value}`} className="quote-option-radio" />
              <span id={faceId} className="quote-option-face">
                {option.label}
                <small>{option.cost}</small>
              </span>
            </div>
          );
        })}
      </RadioGroup>
      <Problem name={name} problem={problem} />
    </div>
  );
}

// The number of people in the drawing: a minus button, the number, and a plus button.
export function PeopleStepper({ value, onChange, problem }: { value: number; onChange: (value: number) => void; problem?: string }) {
  const labelId = `${fieldId("people")}-label`;
  return (
    <div className="quote-field">
      <p id={labelId} className="quote-label quote-label-block">
        How many people are in the drawing?
      </p>
      <div id={fieldId("people")} role="group" aria-labelledby={labelId} className="quote-stepper">
        <Button type="button" data-testid="people-less" aria-label="One person less" disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))} className="quote-stepper-btn">
          −
        </Button>
        <output data-testid="people-count" aria-live="polite">
          {value}
        </output>
        <Button type="button" data-testid="people-more" aria-label="One person more" disabled={value >= MAX_PEOPLE} onClick={() => onChange(Math.min(MAX_PEOPLE, value + 1))} className="quote-stepper-btn">
          +
        </Button>
      </div>
      <p className="quote-help">From 1 to {MAX_PEOPLE} people.</p>
      <Problem name="people" problem={problem} />
    </div>
  );
}
