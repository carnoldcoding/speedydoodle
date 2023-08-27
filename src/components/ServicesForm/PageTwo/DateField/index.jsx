import React from "react";
import { DateFieldStyles } from "./styles";
import { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateField = ({ label, valToChange, update }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [chosen, setChosen] = useState(false);

  const handleChange = (date) => {
    !chosen && setChosen(true);
    setStartDate(date);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const formattedDate = `${month}/${day}/${year}`;
    update("date", formattedDate);
  };
  return (
    <DateFieldStyles>
      <DatePicker
        className={chosen ? "chosen" : null}
        selected={startDate}
        onChange={handleChange}
        onFocus={(e) => (e.target.readOnly = true)}
        withPortal
      />
      <label className={chosen ? "chosen" : null} htmlFor="date">
        {label}
      </label>
    </DateFieldStyles>
  );
};

export default DateField;
