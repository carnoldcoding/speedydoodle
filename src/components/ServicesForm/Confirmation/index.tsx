import type { QuoteFormData } from "../types";

const formatTime = (time: Date | "") =>
  time instanceof Date
    ? time.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

const Confirmation = ({ data }: { data: QuoteFormData }) => {
  const formattedList: { label: string; data: string | number }[] = [
    {
      label: "name",
      data: `${data.firstName} ${data.lastName}`,
    },
    {
      label: "email",
      data: data.email,
    },
    { label: "address", data: data.location },
    {
      label: "type",
      data:
        data.type === "lni"
          ? "Illustrations and Logos"
          : data.type === "custom"
            ? "Custom Caricatures"
            : data.type === "live"
              ? "Event"
              : "",
    },
    { label: "event", data: data.event },
    { label: "details", data: data.additionalInfo },
    {
      label: "description",
      data: data.description,
    },
    {
      label: "Number of People",
      data: data.personCount,
    },
    {
      label: "background",
      data:
        Number(data.background) === 75
          ? "Complex"
          : Number(data.background) === 50
            ? "Simple"
            : "",
    },
    {
      label: "text content",
      data: data.textContent,
    },
    { label: "additional details", data: data.extraDetails },
    {
      label: "Date",
      data:
        data.startTime instanceof Date && data.endTime instanceof Date
          ? `${data.date} | ${formatTime(data.startTime)} - ${formatTime(data.endTime)}`
          : "",
    },
    { label: "Headcount", data: data.headcount },
    {
      label: "price",
      data:
        data.type === "lni"
          ? `$${data.otherPrice}`
          : data.type === "custom"
            ? `$${Number(data.customCost).toFixed(2)}`
            : data.type === "live"
              ? `$${Number(data.totalCost).toFixed(2)}`
              : "",
    },
  ];

  return (
    <section
      data-testid="confirmation"
      className="mt-5 flex w-full flex-col gap-[50px] bg-surface p-[50px] shadow-[0px_5px_8px_rgba(0,0,0,0.25)] max-[400px]:px-[15px] max-[400px]:py-[30px]"
    >
      <header className="flex flex-col items-center">
        <h1 className="text-[clamp(2.5rem,7vw,4rem)] font-bold uppercase">
          thank you!
        </h1>
        <h2 className="text-[clamp(1rem,3vw,2rem)] font-normal text-primary uppercase">
          for your order
        </h2>
        <h3 className="mt-[10px] text-[clamp(0.6rem,3vw,1rem)] font-light uppercase italic">
          expect a response within 24hrs
        </h3>
      </header>
      <div className="h-[2px] w-full bg-white"></div>
      <article>
        <h1 className="text-[clamp(1rem,3vw,2rem)] font-bold uppercase">
          order summary
        </h1>
        {formattedList.map((item, i) =>
          // An empty text and the number 0 are not shown.
          item.data !== "" && item.data !== 0 ? (
            <div key={i} className="py-[clamp(5px,1vw,10px)]">
              <span className="text-[clamp(0.7rem,3vw,1.25rem)] font-light text-primary capitalize">
                {item.label}
              </span>
              <p className="mt-[5px] text-[clamp(1rem,3vw,1.5rem)] font-light">
                {item.data}
              </p>
            </div>
          ) : null
        )}
      </article>
    </section>
  );
};

export default Confirmation;
