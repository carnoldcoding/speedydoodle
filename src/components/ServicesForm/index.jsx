import React from "react";
import { useState, useEffect } from "react";
import { ServicesFormStyles } from "./styles";
import { useMultiStepForm } from "./useMultiStepForm";
import { Link } from "react-router-dom";
import CommissionType from "./CommissionType";
import PageTwo from "./PageTwo";
import Details from "./Details";
import Confirmation from "./Confirmation";
import Modal from "./PageTwo/Modal";

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
      updatedData.totalCost = updatedData.gasCost
        ? updatedData.gasCost + updatedData.eventCost
        : updatedData.eventCost;

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

  const sendEmail = async (emailData) => {
    try {
      const formattedList = [
        {
          label: "name",
          emailData: `${emailData.firstName} ${emailData.lastName}`,
        },
        {
          label: "email",
          emailData: `${emailData.email}`,
        },
        { label: "address", emailData: emailData.location },
        {
          label: "type",
          emailData: `${
            emailData.type == "lni"
              ? "Illustrations and Logos"
              : emailData.type == "custom"
              ? "Custom Caricatures"
              : (emailData.type = "live" ? "Event" : "")
          }`,
        },
        { label: "extra details", emailData: emailData.extraDetails },
        {
          label: "description",
          emailData: emailData.description,
        },
        {
          label: "Number of People",
          emailData: emailData.personCount,
        },
        {
          label: "background",
          emailData: `${
            emailData.background == 75
              ? "Complex"
              : emailData.background == 50
              ? "Simple"
              : ""
          }`,
        },
        {
          label: "text content",
          emailData: emailData.textContent,
        },
        { label: "event", emailData: emailData.event },
        { label: "details", emailData: emailData.additionalInfo },
        {
          label: "Date",
          emailData: `${emailData.date} | ${emailData.startTime.toLocaleString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          )} - ${emailData.endTime.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`,
        },
        ,
        { label: "Headcount", emailData: emailData.headcount },

        {
          label: "price",
          emailData: `${
            emailData.type == "lni"
              ? `$${emailData.otherPrice}`
              : emailData.type == "custom"
              ? `$${emailData.customCost}`
              : (emailData.type = "live" ? `$${emailData.totalCost}` : "")
          }`,
        },
      ];

      let parsedHTML = `<h1>=============</h1><h1>Quote Details</h1><h1>=============</h1>`;
      formattedList.forEach((item) => {
        if (
          item.emailData !== null &&
          item.emailData !== undefined &&
          item.emailData != ""
        ) {
          parsedHTML += `<p style="font-size: 1rem; text-transform: capitalize; font-weight: 600;">${item.label}: <span style="font-weight: 300; text-transform: capitalize;">${item.emailData}</span><p/>`;
        }
      });
      parsedHTML +=
        "<p>Thank you for your inquiry! You can expect a response from the studio within 24 Hours.";

      const response = await fetch(
        "https://speedydoodle-backend-fcbbc4e86733.herokuapp.com/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [emailData.email, "mike@speedydoodle.com"],
            from: "noreply@speedydoodle.com",
            subject: "Your Speedydoodle Quote Confirmation",
            html: parsedHTML,
          }),
        }
      );
      const serverData = await response.json();
      console.log("Response: ", serverData);
    } catch (error) {
      console.error("Error sending email:", error);
    }
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
              <button
                onClick={
                  current === 2
                    ? () => {
                        sendEmail(data);
                      }
                    : null
                }
                className="primary"
              >
                {current === 2 ? "order" : "next"}
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
