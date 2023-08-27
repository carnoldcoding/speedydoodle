import React from "react";
import { DateFieldStyles } from "./styles";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeField = ({ label, valToChange, update }) => {
  const [startTime, setStartTime] = useState(new Date().setHours(0, 0, 0, 0));
  const [chosen, setChosen] = useState(false);

  const handleChange = (time) => {
    !chosen && setChosen(true);
    setStartTime(time);
    update(valToChange, time);
  };
  return (
    <DateFieldStyles>
      <DatePicker
        className={chosen ? "chosen" : null}
        onChange={handleChange}
        selected={startTime}
        showTimeSelect
        showTimeSelectOnly
        dateFormat="h:mm aa"
        timeIntervals={30}
        onFocus={(e) => (e.target.readOnly = true)}
        withPortal
      />
      <label className={chosen ? "chosen" : null} htmlFor="date">
        {label}
      </label>
    </DateFieldStyles>
  );
};

export default TimeField;
