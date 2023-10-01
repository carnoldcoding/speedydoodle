import React from "react";
import InputField from "../InputField";
import DateField from "../DateField";
import TimeField from "../TimeField";
import PricingBreakdown from "../../PricingBreakdown";
import LocationField from "../LocationField";

const Live = ({ update, data }) => {
  return (
    <>
      <div className="row">
        <InputField
          jsPattern={/^[a-zA-Z0-9\s]+$/}
          htmlPattern={"[a-zA-Z0-9s]+"}
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
        <LocationField update={update} valToChange="location" />
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
          distanceTotal={data.totalDistance}
          gasCost={data.gasCost}
        />
      </div>
    </>
  );
};

export default Live;
