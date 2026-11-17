import { useId, useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { UpdateQuoteForm } from "../../types";
import {
  FIELD_BOX,
  FIELD_HEIGHT,
  FIELD_LABEL,
  FIELD_LABEL_RAISED,
  FIELD_WRAPPER,
} from "../fieldStyles";
import ValidityIcon from "../ValidityIcon";

// The form state holds the date as "MM/DD/YYYY".
const parseDateString = (str: string) => {
  if (!str) return undefined;
  const [m, d, y] = str.split("/");
  const parsed = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

const toDateString = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
};

interface DateFieldProps {
  label: string;
  valToChange: "date";
  update: UpdateQuoteForm;
  initialValue: string;
}

const DateField = ({
  label,
  valToChange,
  update,
  initialValue,
}: DateFieldProps) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(() =>
    parseDateString(initialValue)
  );
  const [isValid, setIsValid] = useState(!!initialValue);
  const text = startDate ? toDateString(startDate) : "";

  const handleChange = (date: Date) => {
    setStartDate(date);
    setIsValid(true);
    update(valToChange, toDateString(date));
    setOpen(false);
  };

  return (
    <article className={FIELD_WRAPPER}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="ghost"
            data-testid="date-trigger"
            className={cn(
              FIELD_BOX,
              FIELD_HEIGHT,
              "justify-start transition-all duration-200 hover:bg-transparent hover:text-white dark:hover:bg-transparent",
              startDate && "border-white"
            )}
          >
            {text}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[999] w-auto bg-background p-0">
          <Calendar
            mode="single"
            required
            selected={startDate}
            defaultMonth={startDate}
            onSelect={handleChange}
            classNames={{ today: "rounded-md" }}
            // The old calendar had a red outline on the selected day, and a
            // red day under the pointer on a wide screen.
            className="[&_button[data-day]:hover]:bg-primary [&_button[data-day]:hover]:text-white mobile:[&_button[data-day]:hover]:bg-transparent [&_button[data-selected-single=true]]:bg-transparent [&_button[data-selected-single=true]]:outline-2 [&_button[data-selected-single=true]]:outline-primary"
          />
        </PopoverContent>
      </Popover>
      {/* A button cannot be `required`. This hidden input holds the date, so
          the browser stops the step and shows its message when no date is
          selected. */}
      <input
        aria-hidden
        tabIndex={-1}
        required
        value={text}
        onChange={() => {}}
        className="pointer-events-none absolute bottom-0 left-1/2 size-px opacity-0"
      />
      <Label
        htmlFor={id}
        className={cn(
          FIELD_LABEL,
          "text-[length:1rem] capitalize",
          startDate && FIELD_LABEL_RAISED
        )}
      >
        {label}
      </Label>
      <ValidityIcon valid={isValid} />
    </article>
  );
};

export default DateField;
