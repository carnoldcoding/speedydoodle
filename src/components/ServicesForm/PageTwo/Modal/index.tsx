import { CircleQuestionMark, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FAQS = [
  {
    question: "How are event prices calculated?",
    answer:
      "There is a two hour minimum for events, and the rate for each event is $150/hr. This rate covers the tools of the trade that the artist needs to supply for each event. This includes 11 x 14 sized sheets of paper, and clear protective sleeves for the drawings which are done in marker and color sticks.",
  },
  {
    question: "Can there be additional fees?",
    answer:
      "Holidays, overnight events, and extensive travel may incur additional charges.",
  },
  {
    question: "How many caricatures can you do in an hour?",
    answer:
      "Each caricature in black and white with shading takes about 3-4 minutes each, whereas colored caricatures take about 6-7 minutes each. Which means in an hour I can draw approximately 15-18 faces in black and white, and about 10-12 faces in color. If you are having a large event with a lot of guests, you might consider hiring additional artists to allow more guests to be drawn. We have recommendations that we can contact in our studio if needed.",
  },
  {
    question: "What do you need to setup?",
    answer:
      "The artist will just need a couple of chairs, an outlet for their light, and some space to set up a small easle.",
  },
];

const ICON_BUTTON =
  "size-auto cursor-pointer rounded-none p-0 hover:bg-transparent hover:text-primary dark:hover:bg-transparent";

// The "Have a Question?" control below the form, and the FAQ dialog it opens.
// The dialog stops the scroll of the page while it is open.
const Modal = () => {
  return (
    <Dialog>
      <div className="absolute bottom-[-185px] left-1/2 flex -translate-x-1/2 flex-col items-center justify-center">
        <p>Have a Question?</p>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            aria-label="Open the FAQs"
            className={`mt-[5px] ${ICON_BUTTON}`}
          >
            <CircleQuestionMark className="size-10" />
          </Button>
        </DialogTrigger>
      </div>
      {/* The dialog of shadcn/ui gives no access to its overlay, and the old
          overlay had a blur. The parts are put together here for that. */}
      <DialogPortal>
        <DialogOverlay className="z-[999] backdrop-blur-[4px]" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          // As before, only the close button closes the dialog (and now the Escape key).
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed top-1/2 left-1/2 z-[999] max-h-[520px] w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-y-scroll rounded-[5px] bg-background p-[25px] pt-[35px] leading-[normal] text-white shadow-[0px_10px_20px_rgba(0,0,0,0.9)] outline-none"
        >
          <header>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                aria-label="Close"
                className={`absolute top-[10px] right-[10px] ${ICON_BUTTON}`}
              >
                <X className="size-6" />
              </Button>
            </DialogClose>
            <DialogTitle className="mb-[25px] text-center text-[2rem] leading-[normal] font-bold uppercase">
              FAQs
            </DialogTitle>
          </header>
          {FAQS.map(({ question, answer }) => (
            <details key={question} className="p-[10px]">
              <summary className="cursor-pointer hover:text-primary">
                {question}
              </summary>
              <p className="p-[5px] pl-[25px] leading-[1.5em] font-light">
                {answer}
              </p>
            </details>
          ))}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};

export default Modal;
