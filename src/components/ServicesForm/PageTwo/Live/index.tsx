import PricingBreakdown from "../../PricingBreakdown";
import type { QuoteFormData, UpdateQuoteForm } from "../../types";
import DateField from "../DateField";
import { ROW } from "../fieldStyles";
import InputField from "../InputField";
import LocationField from "../LocationField";
import TimeField from "../TimeField";

interface LiveProps {
  update: UpdateQuoteForm;
  data: QuoteFormData;
}

const Live = ({ update, data }: LiveProps) => {
  return (
    <>
      <div className={ROW}>
        <InputField
          jsPattern={/^[a-zA-Z0-9\s]+$/}
          htmlPattern={"[a-zA-Z0-9]+[a-zA-Z0-9 ]+"}
          label={"Event"}
          valToChange="event"
          update={update}
          defaultValue={data.event}
        />
        <InputField
          jsPattern={/^[0-9]+$/}
          htmlPattern={"^[0-9]+$"}
          label={"Headcount Estimate"}
          valToChange="headcount"
          update={update}
          defaultValue={String(data.headcount || "")}
        />
      </div>
      <div className={ROW}>
        <LocationField
          update={update}
          valToChange="location"
          initialValue={data.location}
        />
      </div>
      <div className={ROW}>
        <DateField
          update={update}
          label={"Date"}
          valToChange={"date"}
          initialValue={data.date}
        />
        <TimeField
          update={update}
          label={"Start Time"}
          valToChange={"startTime"}
          initialValue={data.startTime}
        />
        <TimeField
          update={update}
          label={"End Time"}
          valToChange={"endTime"}
          initialValue={data.endTime}
        />
      </div>
      <div className={ROW}>
        <PricingBreakdown
          eventTotal={data.eventCost}
          timeTotal={data.eventTime}
          gasTotal={data.gasCost}
          total={data.totalCost}
          distanceTotal={data.totalDistance}
        />
      </div>
    </>
  );
};

export default Live;
