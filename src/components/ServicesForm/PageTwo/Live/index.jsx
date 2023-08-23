import React from "react";
import SelectField from "../SelectField";

const Live = ({ update }) => {
  return (
    <>
      <div className="row">
        <SelectField
          options={["wedding", "party", "birthday", "other"]}
          label="Choose an Event"
          select="event"
          valToChange="event"
          update={update}
        />
        <SelectField
          options={["<25", "50", "75", "100+"]}
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
