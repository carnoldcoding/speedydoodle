import styled from "styled-components";
import logos from "../../assets/logos.png";
import illustrations from "../../assets/illustrations.png";
import gifts from "../../assets/gifts.png";
import parties from "../../assets/parties.png";
import books from "../../assets/book.jpg";

export const HomeMenuSection = styled.section`
  display: flex;
  padding: ${(props) => props.theme.padding};
  .grid {
    display: grid;
    justify-content: center;
    width: 100%;
    grid-template-columns: repeat(6, minmax(125px, 165px));
    gap: 1.5rem;

    .grid-item {
      min-height: 225px;
      padding: 25px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: grayscale(50%) opacity(100%);
        -webkit-backdrop-filter: grayscale(50%) opacity(100%);
        pointer-events: none;
        z-index: 1;
        transition: all 0.2s ease;
      }
      &:hover {
        &::after {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: grayscale(10%) opacity(0%);
          -webkit-backdrop-filter: grayscale(10%) opacity(0%);
        }
      }
      h1,
      h3,
      button,
      a {
        z-index: 2;
      }
      h3 {
        color: white;
        font-weight: 300;
        text-transform: uppercase;
        font-size: ${(props) => props.theme.fontSizes.small};
      }
      h1 {
        color: white;
        text-transform: capitalize;
        font-size: ${(props) => props.theme.fontSizes.large};
      }
      button {
        border: 2px solid white;
        background: transparent;
        color: white;
        font-weight: 700;
        letter-spacing: 1.25px;
        height: 35px;
        width: 105px;
        text-transform: uppercase;
        font-size: ${(props) => props.theme.fontSizes.xSmall};
        margin-top: 10px;
        transition: all 0.2s ease;
        &:hover {
          cursor: pointer;
          transform: translateY(-2.5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
      }

      &.illustrations {
        background-image: url(${illustrations});
        background-size: cover;
        grid-column: 3 / 5;

        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
      }
      &.logos {
        background-image: url(${logos});
        background-size: cover;

        grid-column: 1 / 3;
        grid-row: 1;

        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
      }
      &.gifts {
        background-image: url(${gifts});
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        grid-column: 1 / 4;
      }

      &.books {
        background-image: url(${books});
        background-size: cover;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        grid-column: 4/5;
      }

      &.parties {
        background-image: url(${parties});
        background-size: cover;
        background-position: center;
        @media screen and (max-width: 920px) {
          background-position: bottom;
        }

        grid-column: 5 / 7;
        grid-row: 1 / 3;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
    }

    @media screen and (max-width: 920px) {
      display: flex;
      flex-direction: column-reverse;
      .grid-item {
        grid-column: unset !important;
        grid-row: unset !important;
        justify-content: center !important;
        align-items: center !important;
      }
    }
  }
`;
