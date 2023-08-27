import React from "react";
import InputField from "../InputField";
import DateField from "../DateField";
import TimeField from "../TimeField";
import PricingBreakdown from "../../PricingBreakdown";

const Live = ({ update, data }) => {
  return (
    <>
      <div className="row">
        <InputField
          jsPattern={/^[a-zA-Z0-9]+$/}
          htmlPattern={"^[a-zA-Z0-9]+$"}
          label={"Event"}
          valToChange="event"
          update={update}
        />
        <InputField
          jsPattern={/^[0-9]+$/}
          htmlPattern={"^[0-9]+$"}
          label={"Headcount Estimate"}
          valToChange="headcount"
          update={update}
        />
      </div>
      <div className="row">
        <DateField update={update} label={"Date"} valToChange={"date"} />
        <TimeField
          update={update}
          label={"Start Time"}
          valToChange={"startTime"}
        />
        <TimeField update={update} label={"End Time"} valToChange={"endTime"} />
      </div>
      <div className="row">
        <PricingBreakdown
          eventTotal={data.eventCost}
          timeTotal={data.eventTime}
          gasTotal={data.gasCost}
          total={data.totalCost}
        />
      </div>
    </>
  );
};

export default Live;
