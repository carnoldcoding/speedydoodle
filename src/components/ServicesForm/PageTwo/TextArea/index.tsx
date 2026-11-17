import { useId, useState } from "react";
import { cn } from "cn";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TextFieldKey, UpdateQuoteForm } from "../../types";
import {
  FIELD_BOX,
  FIELD_BOX_FILLED_OR_FOCUSED,
  FIELD_LABEL,
  FIELD_LABEL_RAISED_BY_PEER,
  FIELD_WRAPPER,
} from "../fieldStyles";
import ValidityIcon from "../ValidityIcon";

interface TextAreaProps {
  label: string;
  valToChange: TextFieldKey;
  update: UpdateQuoteForm;
}

const TextArea = ({ label, valToChange, update }: TextAreaProps) => {
  const id = useId();
  const [isValid, setIsValid] = useState(false);

  return (
    <div className={FIELD_WRAPPER}>
      <Textarea
        id={id}
        name={valToChange}
        onChange={(e) => {
          setIsValid(e.target.value !== "");
          update(valToChange, e.target.value);
        }}
        placeholder=" "
        required
        className={cn(
          "peer",
          FIELD_BOX,
          FIELD_BOX_FILLED_OR_FOCUSED,
          "block min-h-[150px] pt-[10px]"
        )}
      />
      <Label
        htmlFor={id}
        className={cn(FIELD_LABEL, FIELD_LABEL_RAISED_BY_PEER, "top-[30px]")}
      >
        {label}
      </Label>
      <ValidityIcon valid={isValid} className="top-[30px] size-8" />
    </div>
  );
};

export default TextArea;
