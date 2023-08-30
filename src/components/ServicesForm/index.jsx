import React from "react";
import { useState, useEffect } from "react";
import { ServicesFormStyles } from "./styles";
import { useMultiStepForm } from "./useMultiStepForm";
import { Link } from "react-router-dom";
import CommissionType from "./CommissionType";
import PageTwo from "./PageTwo";
import Details from "./Details";
import Confirmation from "./Confirmation";

const INITIAL_DATA = {
  //All Forms
  type: "", //Radio Buttons
  firstName: "", //Text Field
  lastName: "", //Text Field
  email: "", //Text Field
  extraDetails: "",

  //Live Caricatures
  location: "", //Google API
  event: "", //Select Field (Wedding, Birthday, Graduation, Other)
  headcount: "", //Select Field
  date: "", //Date Field
  startTime: "", //Time Field
  endTime: "", //Time Field

  //Calculated Fields
  distance: 0,
  totalDistance: 0,
  gasCost: 0,
  wage: 135,
  eventTime: 0,
  eventCost: 0,
  totalCost: 0,

  //Custom Caricatures
  personCount: 0, //Number Field (75 first, 60 second, 50 third and on.)
  personCountPrice: 0,
  background: "", //Select Field (None - 0, Complex - 75, Simple - 50)
  textOption: "", //Select Field (Yes or No)
  textContent: "", //Text Field
  description: "",

  //Calculated Fields
  customCost: 150,

  //Logos and Illustrations
  other: [
    { type: "illustration", price: 500 },
    { type: "logo", price: 75 },
  ],
  otherSelection: "",
  otherCost: "",

  //Description
  additionalInfo: "",
};
const ServicesForm = () => {
  const [data, setData] = useState(INITIAL_DATA);

  function update(fieldName, newValue) {
    setData((prev) => {
      const updatedData = {
        ...prev,
        [fieldName]: newValue,
      };

      // Calculate eventTime and eventCost based on updatedData
      if (updatedData.startTime !== "" && updatedData.endTime !== "") {
        updatedData.eventTime =
          (updatedData.endTime.getTime() - updatedData.startTime.getTime()) /
          (1000 * 60 * 60);
        if (updatedData.startTime > updatedData.endTime) {
          updatedData.eventTime += 24;
        }
        updatedData.eventCost = updatedData.wage * updatedData.eventTime;
      }

      //Calculate gasCost based on distance
      if (updatedData.distance !== 0) {
        const mpg = 27;
        const perGallon = 3.7;
        const rawDistance = updatedData.totalDistance;
        updatedData.gasCost = Math.floor((rawDistance / mpg) * perGallon);
      }

      //Update total cost
      if ((updatedData.gasCost !== 0) & (updatedData.eventCost !== 0)) {
        updatedData.totalCost = updatedData.eventCost + updatedData.gasCost;
      }

      //Update person count price
      updatedData.personCount = Number(updatedData.personCount);
      if (updatedData.personCount) {
        let price;
        if (updatedData.personCount === 1) {
          price = 75;
        } else if (updatedData.personCount === 2) {
          price = 135;
        } else if (updatedData.personCount === 3) {
          price = 190;
        } else if (updatedData.personCount > 3) {
          price = 190 + (updatedData.personCount - 3) * 50;
        }
        updatedData.personCountPrice = price;
      } else {
        updatedData.personCountPrice = 0;
      }

      updatedData.customCost =
        150 +
        updatedData.personCountPrice +
        Number(updatedData.background) +
        Number(updatedData.textOption);

      //Update custom count price
      return updatedData;
    });
  }

  const { current, next, back, step, isFirstStep, isLastStep } =
    useMultiStepForm([
      <CommissionType {...data} update={update} />,
      <PageTwo
        data={data}
        type={data.type}
        firstName={data.firstName}
        lastName={data.lastName}
        email={data.email}
        update={update}
      />,
      <Details update={update} />,
      <Confirmation data={data} />,
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
