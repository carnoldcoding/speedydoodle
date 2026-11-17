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
      <div className="row">
        <LocationField
          update={update}
          valToChange="location"
          initialValue={data.location}
        />
      </div>
      <div className="row">
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
