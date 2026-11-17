import React from "react";
import { useState } from "react";
import { ServicesFormStyles } from "./styles";
import { useMultiStepForm } from "./useMultiStepForm";
import { Link } from "react-router-dom";
import CommissionType from "./CommissionType";
import PageTwo from "./PageTwo";
import Details from "./Details";
import Confirmation from "./Confirmation";
import Modal from "./PageTwo/Modal";
import { roundCurrency } from "./pricing";

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
  wage: 150,
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
  otherPrice: "",

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
        updatedData.eventCost = roundCurrency(
          updatedData.wage * updatedData.eventTime
        );
      }

      //Calculate gasCost based on distance
      if (updatedData.distance !== 0) {
        const mpg = 27;
        const perGallon = 3.7;
        const rawDistance = updatedData.totalDistance;
        updatedData.gasCost = roundCurrency((rawDistance / mpg) * perGallon);
      }

      //Update total cost
      updatedData.totalCost = roundCurrency(
        updatedData.gasCost
          ? updatedData.gasCost + updatedData.eventCost
          : updatedData.eventCost
      );

      //Update person count price
      updatedData.personCount = Number(updatedData.personCount);
      if (updatedData.personCount) {
        let price;
        if (updatedData.personCount === 1) {
          price = 75;
        } else if (updatedData.personCount === 2) {
          price = 150;
        } else if (updatedData.personCount === 3) {
          price = 190;
        } else if (updatedData.personCount > 3) {
          price = 190 + (updatedData.personCount - 3) * 50;
        }
        updatedData.personCountPrice = price;
      } else {
        updatedData.personCountPrice = 0;
      }

      updatedData.customCost = roundCurrency(
        150 +
          updatedData.personCountPrice +
          Number(updatedData.background) +
          Number(updatedData.textOption)
      );

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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    // Step 3 is the last step with input. It sends the quote to the server.
    if (current !== 2) {
      next();
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitQuote(data);
      next();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  // The time picker gives a Date. The server takes "HH:MM" on a 24-hour clock.
  const formatTime = (time) =>
    time instanceof Date
      ? `${String(time.getHours()).padStart(2, "0")}:${String(
          time.getMinutes()
        ).padStart(2, "0")}`
      : "";

  // The fields the server accepts for each quote type. The server builds the
  // email and calculates the price, so no email text and no price is sent.
  const buildQuote = (formData) => {
    const quote = {
      type: formData.type,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      additionalInfo: formData.additionalInfo,
    };
    if (formData.type === "live") {
      return {
        ...quote,
        event: formData.event,
        headcount: formData.headcount,
        location: formData.location,
        date: formData.date,
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
      };
    }
    if (formData.type === "custom") {
      const includeText = Number(formData.textOption) === 25;
      return {
        ...quote,
        description: formData.description,
        background:
          Number(formData.background) === 75
            ? "complex"
            : Number(formData.background) === 50
            ? "simple"
            : "none",
        personCount: formData.personCount,
        includeText,
        ...(includeText ? { textContent: formData.textContent } : {}),
      };
    }
    return { ...quote, selection: formData.otherSelection };
  };

  const FIELD_LABELS = {
    type: "the commission type",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    additionalInfo: "Additional Details",
    event: "Event",
    headcount: "Headcount Estimate",
    location: "Location",
    date: "Date",
    startTime: "Start Time",
    endTime: "End Time",
    description: "Caricature Request",
    background: "Background",
    personCount: "Number of People",
    includeText: "Text Display",
    textContent: "Text Content",
    selection: "the logo or illustration choice",
  };

  const submitQuote = async (formData) => {
    let response;
    try {
      response = await fetch("https://api.speedydoodle.com/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildQuote(formData)),
      });
    } catch (error) {
      throw new Error(
        "We could not reach the server. Check your connection and try again."
      );
    }
    if (response.status === 201) return;
    if (response.status === 429) {
      throw new Error(
        "Too many requests were sent in a short time. Wait one minute, then try again."
      );
    }
    if (response.status === 400) {
      const problem = await response.json().catch(() => ({}));
      const label = FIELD_LABELS[problem.field];
      throw new Error(
        label
          ? `Check ${label}: ${problem.message} Use the back button to change it.`
          : "A field has a value that is not valid. Use the back button to check your entries."
      );
    }
    throw new Error(
      "Your request was not sent because of a server problem. Try again in a few minutes."
    );
  };

  return (
    <ServicesFormStyles>
      <article className="wrapper">
        <form onSubmit={onSubmit}>
          <ul className="progress">
            <li className={current + 1 > 0 && "active"}>
              <h3>type</h3>
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
          {submitError && (
            <p className="submit-error" role="alert">
              {submitError}
            </p>
          )}
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
              <button className="primary" disabled={submitting}>
                {current === 2 ? (submitting ? "sending" : "order") : "next"}
              </button>
            )}
          </article>
        </form>
        <Modal />
      </article>
    </ServicesFormStyles>
  );
};

export default ServicesForm;
