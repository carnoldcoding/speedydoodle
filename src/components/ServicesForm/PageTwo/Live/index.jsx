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
      <div className="row"></div>
    </>
  );
};

export default Live;
