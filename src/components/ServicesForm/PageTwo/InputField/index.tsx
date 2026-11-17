import { useId, useState } from "react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TextFieldKey, UpdateQuoteForm } from "../../types";
import {
  FIELD_BOX,
  FIELD_BOX_FILLED_OR_FOCUSED,
  FIELD_HEIGHT,
  FIELD_LABEL,
  FIELD_LABEL_RAISED_BY_PEER,
  FIELD_WRAPPER,
} from "../fieldStyles";
import ValidityIcon from "../ValidityIcon";

interface InputFieldProps {
  // The pattern for the valid/invalid icon.
  jsPattern: RegExp;
  // The pattern for the validation that the browser does.
  htmlPattern: string;
  label: string;
  valToChange: TextFieldKey;
  update: UpdateQuoteForm;
  defaultValue?: string;
  // The text the browser shows when the value does not match the pattern.
  title?: string;
}

const InputField = ({
  jsPattern,
  htmlPattern,
  label,
  valToChange,
  update,
  defaultValue,
  title,
}: InputFieldProps) => {
  const id = useId();
  const [isValid, setIsValid] = useState(() =>
    defaultValue ? jsPattern.test(defaultValue) : false
  );

  return (
    <div className={FIELD_WRAPPER}>
      <Input
        id={id}
        name={valToChange}
        onChange={(e) => {
          const valid = jsPattern.test(e.target.value) && e.target.value !== "";
          setIsValid(valid);
          update(valToChange, e.target.value);
        }}
        type="text"
        placeholder=" "
        required
        pattern={htmlPattern}
        title={title}
        defaultValue={defaultValue || ""}
        className={cn(
          "peer",
          FIELD_BOX,
          FIELD_HEIGHT,
          FIELD_BOX_FILLED_OR_FOCUSED
        )}
      />
      <Label
        htmlFor={id}
        className={cn(FIELD_LABEL, FIELD_LABEL_RAISED_BY_PEER)}
      >
        {label}
      </Label>
      <ValidityIcon valid={isValid} />
    </div>
  );
};

export default InputField;
