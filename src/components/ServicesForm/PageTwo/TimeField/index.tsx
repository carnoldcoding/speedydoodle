import { useId, useState } from "react";
import { cn } from "cn";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UpdateQuoteForm } from "../../types";
import {
  FIELD_LABEL,
  FIELD_LABEL_RAISED,
  FIELD_WRAPPER,
} from "../fieldStyles";
import { SELECT_TRIGGER } from "../SelectField";
import ValidityIcon from "../ValidityIcon";

// One option for each 30 minutes of the day. The value is "HH:mm" on a
// 24-hour clock, and the visitor sees "h:mm AM/PM".
const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const time = new Date(2000, 0, 1, Math.floor(index / 2), (index % 2) * 30);
  return { value: format(time, "HH:mm"), display: format(time, "h:mm a") };
});

// The form state holds a Date: the selected time on the current day.
const toDate = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  const time = new Date();
  time.setHours(hours, minutes, 0, 0);
  return time;
};

interface TimeFieldProps {
  label: string;
  valToChange: "startTime" | "endTime";
  update: UpdateQuoteForm;
  initialValue: Date | "";
}

const TimeField = ({
  label,
  valToChange,
  update,
  initialValue,
}: TimeFieldProps) => {
  const id = useId();
  const [value, setValue] = useState(
    initialValue instanceof Date ? format(initialValue, "HH:mm") : ""
  );
  const chosen = value !== "";

  return (
    <article className={FIELD_WRAPPER}>
      <Select
        name={valToChange}
        required
        value={value}
        onValueChange={(next) => {
          // The native select behind the control can report "" when it starts.
          if (next === "") return;
          setValue(next);
          update(valToChange, toDate(next));
        }}
      >
        <SelectTrigger
          id={id}
          data-testid={`select-${valToChange}`}
          className={cn(SELECT_TRIGGER, chosen && "border-white")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="z-[999] max-h-[300px] min-w-[200px]"
        >
          {TIME_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="px-[5px] py-[10px] text-[1.25rem] text-white focus:bg-primary focus:text-white data-[state=checked]:bg-primary mobile:focus:bg-transparent mobile:data-[state=checked]:bg-primary"
            >
              {option.display}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label
        htmlFor={id}
        className={cn(FIELD_LABEL, "capitalize", chosen && FIELD_LABEL_RAISED)}
      >
        {label}
      </Label>
      <ValidityIcon valid={chosen} />
    </article>
  );
};

export default TimeField;
