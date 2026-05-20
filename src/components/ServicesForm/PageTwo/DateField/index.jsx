import React, { useState } from "react";
import { DateFieldStyles } from "./styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const parseDateString = (str) => {
  if (!str) return null;
  const [m, d, y] = str.split("/");
  const parsed = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  return isNaN(parsed.getTime()) ? null : parsed;
};

const DateField = ({ label, valToChange, update, initialValue }) => {
  const [startDate, setStartDate] = useState(() => parseDateString(initialValue));
  const [isValid, setIsValid] = useState(!!initialValue);

  const handleChange = (date) => {
    setStartDate(date);
    setIsValid(true);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    update(valToChange, `${month}/${day}/${year}`);
  };

  return (
    <DateFieldStyles>
      <DatePicker
        className={startDate ? "chosen" : null}
        selected={startDate}
        onChange={handleChange}
        onFocus={(e) => (e.target.readOnly = true)}
        placeholderText=" "
        required
        withPortal
      />
      <label className={startDate ? "chosen" : null} htmlFor="date">
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

export default DateField;
