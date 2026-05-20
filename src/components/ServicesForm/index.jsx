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
      // Helper function to format service type
      const formatServiceType = (type) => {
        switch (type) {
          case "lni": return "Illustrations and Logos";
          case "custom": return "Custom Caricatures";
          case "live": return "Live Event";
          default: return "";
        }
      };
  
      // Helper function to format background complexity
      const formatBackground = (background) => {
        if (background == 75) return "Complex";
        if (background == 50) return "Simple";
        return "";
      };
  
      // Helper function to format price
      const formatPrice = (type, emailData) => {
        switch (type) {
          case "lni": return emailData.otherPrice ? `$${emailData.otherPrice}` : "";
          case "custom": return emailData.customCost ? `$${emailData.customCost}` : "";
          case "live": return emailData.totalCost ? `$${emailData.totalCost}` : "";
          default: return "";
        }
      };
  
      // Helper function to format date and time
      const formatDateTime = (date, startTime, endTime) => {
        if (!date || !startTime || !endTime) return "";
        const formattedStart = startTime.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit", 
          hour12: true
        });
        const formattedEnd = endTime.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        return `${date} | ${formattedStart} - ${formattedEnd}`;
      };
  
      // Clean data structure - only include non-empty values
      const quoteDetails = [
        { label: "Customer Name", value: `${emailData.firstName || ''} ${emailData.lastName || ''}`.trim() },
        { label: "Email", value: emailData.email },
        { label: "Address", value: emailData.location },
        { label: "Service Type", value: formatServiceType(emailData.type) },
        { label: "Number of People", value: emailData.personCount },
        { label: "Background Style", value: formatBackground(emailData.background) },
        { label: "Description", value: emailData.description },
        { label: "Extra Details", value: emailData.extraDetails },
        { label: "Text Content", value: emailData.textContent },
        { label: "Event Details", value: emailData.event },
        { label: "Additional Information", value: emailData.additionalInfo },
        { label: "Event Date & Time", value: formatDateTime(emailData.date, emailData.startTime, emailData.endTime) },
        { label: "Expected Headcount", value: emailData.headcount },
        { label: "Estimated Price", value: formatPrice(emailData.type, emailData) }
      ].filter(item => item.value && item.value !== "" && item.value !== "undefined undefined");
  
      // Generate professional HTML email
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpeedyDoodle Quote Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">SpeedyDoodle</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Quote Confirmation</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Thank you for your inquiry!</h2>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                      We've received your quote request and our team is reviewing the details. You can expect a personalized response within 24 hours.
                    </p>
                    
                    <!-- Quote Details -->
                    <div style="background-color: #f8f9fa; padding: 25px; border-radius: 6px; margin: 20px 0;">
                      <h3 style="color: #333333; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Quote Details</h3>
                      
                      ${quoteDetails.map(item => `
                        <div style="margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 12px;">
                          <strong style="color: #333333; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${item.label}:</strong>
                          <div style="color: #555555; margin-top: 5px; font-size: 16px;">${item.value}</div>
                        </div>
                      `).join('')}
                    </div>
                    
                    <div style="background-color: #e8f4fd; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0;">
                      <p style="margin: 0; color: #333333; font-size: 16px;">
                        <strong>What's next?</strong><br>
                        Our team will review your requirements and send you a detailed proposal with pricing, timeline, and next steps.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #333333; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                    <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.5;">
                      <strong>SpeedyDoodle Studio</strong><br>
                      Professional Caricatures & Illustrations
                    </p>
                    <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                      This is an automated confirmation email. If you have any immediate questions, 
                      please contact us directly at mike@speedydoodle.com
                    </p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #555555;">
                      <p style="color: #999999; margin: 0; font-size: 11px;">
                        © ${new Date().getFullYear()} SpeedyDoodle. All rights reserved.<br>
                        You're receiving this because you requested a quote through our website.
                      </p>
                    </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  
      // Generate clean text version
      const textContent = `
  SPEEDYDOODLE - Quote Confirmation
  ==================================
  
  Thank you for your inquiry!
  
  We've received your quote request and our team is reviewing the details. You can expect a personalized response within 24 hours.
  
  QUOTE DETAILS:
  ${quoteDetails.map(item => `${item.label}: ${item.value}`).join('\n')}
  
  WHAT'S NEXT:
  Our team will review your requirements and send you a detailed proposal with pricing, timeline, and next steps.
  
  ---
  SpeedyDoodle Studio
  Professional Caricatures & Illustrations
  
  This is an automated confirmation email. If you have any immediate questions, please contact us directly at mike@speedydoodle.com
  
  © ${new Date().getFullYear()} SpeedyDoodle. All rights reserved.
  You're receiving this because you requested a quote through our website.
      `.trim();
  
      // Send email with proper anti-spam headers
      const response = await fetch(
        "https://api.speedydoodle.com/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [emailData.email, "mike@speedydoodle.com"],
            subject: `Quote Confirmation - ${formatServiceType(emailData.type)} | SpeedyDoodle`,
            html: htmlContent,
            text: textContent
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const serverData = await response.json();
      console.log("Email sent successfully:", serverData);
      return serverData;
  
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; // Re-throw so calling code can handle it
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
