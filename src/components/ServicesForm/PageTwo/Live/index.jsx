import React from "react";
import InputField from "../InputField";
import DateField from "../DateField";

const Live = ({ update }) => {
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
      </div>
    </>
  );
};

export default Live;
