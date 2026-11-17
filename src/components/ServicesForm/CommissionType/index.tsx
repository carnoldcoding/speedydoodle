import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CommissionKind, UpdateQuoteForm } from "../types";

const OPTIONS: { value: CommissionKind; label: string }[] = [
  { value: "live", label: "live caricatures" },
  { value: "custom", label: "custom caricatures" },
  { value: "lni", label: "logos & illustrations" },
];

const isCommissionKind = (value: string): value is CommissionKind =>
  OPTIONS.some((option) => option.value === value);

const CommissionType = ({ update }: { update: UpdateQuoteForm }) => {
  return (
    // The group has no initial value. As before, the visitor selects the type
    // again after a return to this step.
    <RadioGroup
      name="item"
      required
      onValueChange={(value) => {
        if (isCommissionKind(value)) update("type", value);
      }}
      className="mt-[50px] flex max-w-[400px] flex-col items-center justify-center gap-8"
    >
      {OPTIONS.map(({ value, label }) => (
        <div
          key={value}
          className="flex w-full cursor-pointer items-center justify-between rounded-[5px] bg-surface px-[15px] shadow-[0_5px_7px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-[5px] hover:shadow-[0_5px_10px_rgba(0,0,0,0.6)]"
        >
          <Label
            htmlFor={value}
            className="block w-full cursor-pointer p-3 text-[length:clamp(0.9rem,3vw,1.2rem)] leading-[normal] font-bold tracking-[1px] uppercase"
          >
            {label}
          </Label>
          <RadioGroupItem
            id={value}
            value={value}
            className="size-[clamp(15px,3vw,25px)] cursor-pointer border-2 border-white bg-transparent shadow-none data-[state=checked]:border-valid data-[state=checked]:bg-valid dark:bg-transparent dark:data-[state=checked]:bg-valid [&_svg]:hidden"
          />
        </div>
      ))}
    </RadioGroup>
  );
};

export default CommissionType;
