import React from "react";
import { useState } from "react";
import { ServicesFormStyles } from "./styles";
import { useMultiStepForm } from "./useMultiStepForm";
import { Link } from "react-router-dom";
import CommissionType from "./CommissionType";
import PageTwo from "./PageTwo";

const INITIAL_DATA = {
  type: "",
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  event: "",
  headcount: "",
  date: "",
  startTime: "",
  endTime: "",
};
const ServicesForm = () => {
  const [data, setData] = useState(INITIAL_DATA);

  function update(fields) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }
  const { current, next, back, step, isFirstStep, isLastStep } =
    useMultiStepForm([
      <CommissionType {...data} update={update} />,
      <PageTwo {...data} update={update} />,
      <div>Three</div>,
      <div>Four</div>,
    ]);

  function onSubmit(e) {
    e.preventDefault();
    next();
  }

  return (
    <ServicesFormStyles>
      <article className="wrapper">
        <form onSubmit={onSubmit}>
          <ul className="progress">
            <li className={current + 1 > 0 && "active"}>
              <h3>commission type</h3>
              <h1>1</h1>
            </li>
            <li className={current + 1 > 1 && "active"}>
              <h3>pricing</h3>
              <h1>2</h1>
            </li>
            <li className={current + 1 > 2 && "active"}>
              <h3>details</h3>
              <h1>3</h1>
            </li>
            <li className={current + 1 > 3 && "active"}>
              <h3>confirmation</h3>
              <h1>4</h1>
            </li>
          </ul>
          {step}
          <article className="controls">
            {!isFirstStep && !isLastStep && (
              <button className="secondary" onClick={back} type="button">
                back
              </button>
            )}
            {isLastStep ? (
              <Link to="/homepage">
                <button className="primary">home</button>
              </Link>
            ) : (
              <button className="primary">
                {current === 2 ? "order" : "next"}
              </button>
            )}
          </article>
        </form>
      </article>
    </ServicesFormStyles>
  );
};

export default ServicesForm;
