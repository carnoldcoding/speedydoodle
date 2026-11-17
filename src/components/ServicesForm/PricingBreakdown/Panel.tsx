import type { CSSProperties, ReactNode } from "react";

// The parts that the two price breakdown panels share.

export const BreakdownPanel = ({
  total,
  children,
}: {
  total: number;
  children: ReactNode;
}) => (
  <article className="mt-[-25px] flex w-full max-w-content flex-col items-center gap-8 p-page">
    <header className="mt-[10px]">
      <h1 className="text-center text-[clamp(1.2rem,3vw,2.4rem)] font-bold uppercase">
        pricing breakdown
      </h1>
    </header>
    <article className="flex w-full flex-wrap justify-around gap-8">
      {children}
    </article>
    <article className="flex w-full flex-col items-center justify-center">
      <h3 className="text-[1.17em] font-bold text-primary uppercase">total</h3>
      <h1
        data-testid="price-total"
        className="text-[clamp(3rem,10vw,5rem)] font-bold"
      >
        <span className="text-primary">$</span>
        {Number(total).toFixed(2)}
      </h1>
    </article>
  </article>
);

export const BreakdownGroup = ({ children }: { children: ReactNode }) => (
  <article className="flex flex-col items-start justify-start gap-4">
    {children}
  </article>
);

// A round icon with a ring. `percent` is the part of the ring that is red.
// The value changes at run time, so it goes to the class as a CSS variable.
export const BreakdownIcon = ({
  percent,
  children,
}: {
  percent: string;
  children: ReactNode;
}) => (
  <article className="self-center">
    <div
      style={{ "--percent": percent } as CSSProperties}
      className="relative grid place-items-center rounded-full bg-[conic-gradient(from_0deg,var(--primary)_var(--percent),white_var(--percent))] p-[clamp(20px,3vw,30px)] text-[clamp(2rem,7vw,4rem)]"
    >
      <span className="absolute inset-[5px] rounded-full bg-surface"></span>
      <span className="relative [&>svg]:size-[1em]">{children}</span>
    </div>
  </article>
);

export const BreakdownRow = ({
  value,
  label,
}: {
  value: ReactNode;
  label: string;
}) => (
  <div className="flex gap-[clamp(5px,1vw,10px)]">
    <span className="text-[clamp(1rem,3vw,2rem)] text-primary">{value}</span>
    <p className="text-[clamp(1rem,3vw,2rem)] capitalize">{label}</p>
  </div>
);
