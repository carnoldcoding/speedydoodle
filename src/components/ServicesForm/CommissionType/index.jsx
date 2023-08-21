import React from "react";
import { CommissionTypeStyles } from "./styles";

const CommissionType = ({ type, update }) => {
  return (
    <CommissionTypeStyles>
      <div className="radio-item">
        <label htmlFor="item">live caricatures</label>
        <input
          type="radio"
          name="item"
          id=""
          value="live"
          onChange={(e) => {
            update({ type: e.target.value });
          }}
        />

        <label htmlFor="item">custom caricatures</label>
        <input type="radio" name="item" id="" value="custom" />

        <label htmlFor="item">logos</label>
        <input type="radio" name="item" id="" value="logos" />

        <label htmlFor="item">illustrations</label>
        <input type="radio" name="item" id="" value="illustrations" />
      </div>
    </CommissionTypeStyles>
  );
};

export default CommissionType;
