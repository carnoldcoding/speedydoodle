import React from "react";
import { CommissionTypeStyles } from "./styles";

const CommissionType = ({ type, update }) => {
  return (
    <CommissionTypeStyles>
      <div className="radio-item">
        <label htmlFor="live">live caricatures</label>
        <input
          type="radio"
          name="item"
          id="live"
          value="live"
          onChange={(e) => {
            update("type", e.target.value);
          }}
          required
        />
      </div>

      <div className="radio-item">
        <label htmlFor="custom">custom caricatures</label>
        <input
          type="radio"
          name="item"
          id="custom"
          value="custom"
          onChange={(e) => {
            update("type", e.target.value);
          }}
        />
      </div>

      <div className="radio-item">
        <label htmlFor="logos">logos</label>
        <input
          type="radio"
          name="item"
          id="logos"
          value="logos"
          onChange={(e) => {
            update("type", e.target.value);
          }}
        />
      </div>

      <div className="radio-item">
        <label htmlFor="illustrations">illustrations</label>
        <input
          type="radio"
          name="item"
          id="illustrations"
          value="illustrations"
          onChange={(e) => {
            update("type", e.target.value);
          }}
        />
      </div>
    </CommissionTypeStyles>
  );
};

export default CommissionType;
