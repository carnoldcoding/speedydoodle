import React from "react";
import { useState } from "react";
import { ServicesFormStyles } from "./styles";
import { useMultiStepForm } from "./useMultiStepForm";
const ServicesForm = () => {
  const { steps, goTo, current, next, back, step } = useMultiStepForm([
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
              {current < 3 && current != 3 ? (
                <button type="button" className="secondary" onClick={back}>
                  back
                </button>
              ) : (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    goTo(0);
                  }}
                >
                  restart
                </button>
              )}
              {current == 2 && (
                <button type="button" className="primary" onClick={next}>
                  order
                </button>
              )}
              {current < 2 && (
                <button type="button" className="primary" onClick={next}>
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
