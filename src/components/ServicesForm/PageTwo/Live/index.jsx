import React from "react";
import InputField from "../InputField";

const Live = ({ update }) => {
  return (
    <>
      <InputField
        jsPattern={/^[A-Za-z]+$/}
        htmlPattern={"[A-Za-z]+"}
        label={"Location"}
        valToChange="location"
        update={update}
      />
      <div className="row">
        <InputField
          jsPattern={/^[A-Za-z]+$/}
          htmlPattern={"[A-Za-z]+"}
          label={"Event"}
          valToChange="event"
          update={update}
        />
        <InputField
          jsPattern={/^-?\d*\.?\d+$/}
          htmlPattern={"-?d*.?d+"}
          label={"Headcount"}
          valToChange="headcount"
          update={update}
        />
      </div>
    </>
  );
};

export default Live;
