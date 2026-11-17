import { useId, useState } from "react";
import { cn } from "cn";
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
  FIELD_BOX,
  FIELD_LABEL,
  FIELD_LABEL_RAISED,
  FIELD_WRAPPER,
} from "../fieldStyles";
import ValidityIcon from "../ValidityIcon";

// The trigger of a select, in the shape of the other fields. The arrow of the
// shadcn/ui trigger is hidden, because the old select had no arrow.
export const SELECT_TRIGGER = cn(
  FIELD_BOX,
  "justify-start data-[size=default]:h-[clamp(40px,8vw,50px)] dark:hover:bg-transparent [&>svg]:hidden"
);

interface SelectFieldProps {
  valToChange: "background" | "textOption";
  update: UpdateQuoteForm;
  label: string;
  options: { display: string; value: number }[];
}

const SelectField = ({
  valToChange,
  update,
  label,
  options,
}: SelectFieldProps) => {
  const id = useId();
  // The field starts empty each time the step opens, as the old select did.
  const [value, setValue] = useState("");
  const chosen = value !== "";

  return (
    <div className={FIELD_WRAPPER}>
      <Select
        name={valToChange}
        required
        value={value}
        onValueChange={(next) => {
          // The native select behind the control can report "" when it starts.
          if (next === "") return;
          setValue(next);
          update(valToChange, next);
        }}
      >
        <SelectTrigger
          id={id}
          data-testid={`select-${valToChange}`}
          className={cn(SELECT_TRIGGER, "capitalize", chosen && "border-white")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[999]">
          {options.map(({ display, value: optionValue }) => (
            <SelectItem
              key={optionValue}
              value={String(optionValue)}
              className="text-[length:clamp(0.9rem,3vw,1.2rem)] capitalize"
            >
              {display}
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
    </div>
  );
};

export default SelectField;
