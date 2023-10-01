import React from "react";
import { ModalStyles } from "./styles";
import { useState } from "react";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggle() {
    setIsOpen(!isOpen);
    isOpen
      ? (document.body.style.overflow = "visible")
      : (document.body.style.overflow = "hidden");
  }
  return (
    <ModalStyles>
      <div class="help">
        <p>Have a Question?</p>
        <ion-icon name="help-circle-outline" onClick={toggle}></ion-icon>
      </div>
      {isOpen && (
        <div class="modal-container">
          <div className="modal-wrapper">
            <header>
              <ion-icon name="close-outline" onClick={toggle}></ion-icon>
              <h1>FAQs</h1>
            </header>

            <details>
              <summary>How are event prices calculated?</summary>
              <p>
                There is a two hour minimum for events, and the rate for each
                event is $135/hr. This rate covers the tools of the trade that
                the artist needs to supply for each event. This includes 11 x 14
                sized sheets of paper, and clear protective sleeves for the
                drawings which are done in marker and color sticks.
              </p>
            </details>
            <details>
              <summary>Can there be additional fees?</summary>
              <p>
                Holidays, overnight events, and extensive travel may incur
                additional charges.
              </p>
            </details>
            <details>
              <summary>How many caricatures can you do in an hour?</summary>
              <p>
                Each caricature in black and white with shading takes about 3-4
                minutes each, whereas colored caricatures take about 6-7 minutes
                each. Which means in an hour I can draw approximately 15-18
                faces in black and white, and about 10-12 faces in color. If you
                are having a large event with a lot of guests, you might
                consider hiring additional artists to allow more guests to be
                drawn. We have recommendations that we can contact in our studio
                if needed.
              </p>
            </details>

            <details>
              <summary>What do you need to setup?</summary>
              <p>
                The artist will just need a couple of chairs, an outlet for
                their light, and some space to set up a small easle.
              </p>
            </details>
          </div>
        </div>
      )}
    </ModalStyles>
  );
};

export default Modal;
