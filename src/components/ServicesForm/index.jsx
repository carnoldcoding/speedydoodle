import React from "react";
import { useState } from "react";
import { ServicesFormStyles } from "./styles";
import { useMultiStepForm } from "./useMultiStepForm";
const ServicesForm = () => {
  const { steps, goTo, current, next, back, step, isFirstStep, isLastStep } =
    useMultiStepForm([
      <div>One</div>,
      <div>Two</div>,
      <div>Three</div>,
      <div>Four</div>,
    ]);

  return (
    <>
      <ServicesFormStyles>
        <article className="wrapper">
          <form action="">
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
            <div>{step}</div>
            <article className="controls">
              {!isFirstStep && !isLastStep && (
                <button className="secondary" onClick={back} type="button">
                  back
                </button>
              )}
              {isLastStep ? (
                <button
                  onClick={() => {
                    goTo(0);
                  }}
                  className="primary"
                  type="button"
                >
                  reset
                </button>
              ) : (
                <button onClick={next} className="primary" type="button">
                  next
                </button>
              )}
            </article>
          </form>
        </article>
      </ServicesFormStyles>
    </>
  );
};

export default ServicesForm;
