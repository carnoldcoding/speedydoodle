// The classes that the fields of the form share. Each field is a box with a
// label that rests in the box, then moves up to the border when the field has
// a value or the focus.

export const ROW =
  "flex flex-wrap items-center justify-center gap-[clamp(1.5rem,3vw,2rem)]";

export const FIELD_WRAPPER = "relative min-w-[250px] flex-1";

// The box of an input, a textarea, a select trigger or the date button.
// These classes replace the size, border and corners of the shadcn/ui control.
export const FIELD_BOX =
  "w-full rounded-[10px] border-2 border-[grey] bg-transparent px-[10px] py-0 pr-[50px] text-[length:clamp(0.9rem,3vw,1.2rem)] font-normal text-white shadow-none md:text-[length:clamp(0.9rem,3vw,1.2rem)] dark:bg-transparent";

export const FIELD_HEIGHT = "h-[clamp(40px,8vw,50px)]";

export const FIELD_LABEL =
  "pointer-events-none absolute top-1/2 left-[10px] block -translate-y-1/2 bg-surface px-[10px] text-[length:clamp(0.9rem,3vw,1.2rem)] leading-[normal] font-normal text-[grey] transition-all duration-200";

// The label on the border. Use it when React state knows that the field has a value.
export const FIELD_LABEL_RAISED =
  "top-0 left-[15px] border-x-2 border-white text-[length:clamp(0.7rem,2vw,0.9rem)] text-white";

// The same position, from the state of the input before the label (the `peer`).
export const FIELD_LABEL_RAISED_BY_PEER =
  "peer-focus:top-0 peer-focus:left-[15px] peer-focus:border-x-2 peer-focus:border-white peer-focus:text-[length:clamp(0.7rem,2vw,0.9rem)] peer-focus:text-white peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-[15px] peer-[:not(:placeholder-shown)]:border-x-2 peer-[:not(:placeholder-shown)]:border-white peer-[:not(:placeholder-shown)]:text-[length:clamp(0.7rem,2vw,0.9rem)] peer-[:not(:placeholder-shown)]:text-white";

// The border of a text control that has a value or the focus.
export const FIELD_BOX_FILLED_OR_FOCUSED =
  "focus-visible:border-white focus-visible:ring-0 [&:not(:placeholder-shown)]:border-white";
