import React from "react";
import SelectField from "../SelectField";
import InputField from "../InputField";

const Live = ({ update }) => {
  return (
    <>
      <div className="row">
        <InputField
          jsPattern={/^[a-zA-Z0-9]+$/}
          htmlPattern={"^[a-zA-Z0-9]+$"}
          label={"Event Type"}
          valToChange="event"
          update={update}
        />
        <SelectField
          options={["<25", "25-50", "51-75", "100+"]}
          label="Headcount Estimate"
          select="headcount"
          valToChange="headcount"
          update={update}
        />
      </div>
    </>
  );
};

export default Live;
