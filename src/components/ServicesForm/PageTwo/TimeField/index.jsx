import React, { useState } from "react";
import { DateFieldStyles } from "./styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeField = ({ label, valToChange, update, initialValue }) => {
  const [startTime, setStartTime] = useState(initialValue instanceof Date ? initialValue : null);
  const [isValid, setIsValid] = useState(initialValue instanceof Date);

  const handleChange = (time) => {
    setStartTime(time);
    setIsValid(true);
    update(valToChange, time);
  };

  return (
    <DateFieldStyles>
      <DatePicker
        className={startTime ? "chosen" : null}
        onChange={handleChange}
        selected={startTime}
        showTimeSelect
        showTimeSelectOnly
        dateFormat="h:mm aa"
        timeIntervals={30}
        onFocus={(e) => (e.target.readOnly = true)}
        placeholderText=" "
        required
        withPortal
      />
      <label className={startTime ? "chosen" : null} htmlFor="date">
        {label}
      </label>
      <ion-icon
        id="valid"
        name="checkmark-circle-outline"
        style={{ display: isValid ? "block" : "none" }}
      ></ion-icon>
      <ion-icon
        id="invalid"
        name="close-circle-outline"
        style={{ display: isValid ? "none" : "block" }}
      ></ion-icon>
    </DateFieldStyles>
  );
};

export default TimeField;
