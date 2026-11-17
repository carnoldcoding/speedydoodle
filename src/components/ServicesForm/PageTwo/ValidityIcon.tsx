import { CircleCheck, CircleX } from "lucide-react";
import { cn } from "cn";

// The green check or the red cross at the right side of a field.
const ValidityIcon = ({
  valid,
  className,
}: {
  valid: boolean;
  className?: string;
}) => {
  const Icon = valid ? CircleCheck : CircleX;
  return (
    <Icon
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 right-[10px] size-[clamp(1.5rem,3vw,2rem)] -translate-y-1/2",
        valid ? "text-valid" : "text-destructive",
        className
      )}
    />
  );
};

export default ValidityIcon;
