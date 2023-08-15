import styled from "styled-components";

export const HomeMenuSection = styled.section`
  display: flex;
  padding: ${(props) => props.theme.padding};
  .grid {
    display: grid;
    justify-content: center;
    width: 100%;
    grid-template-columns: repeat(3, minmax(250px, 330px));
    gap: 1.5rem;

    .grid-item {
      min-height: 225px;
      padding: 25px;
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
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
      }

      &.illustrations {
        background: pink;

        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
      }
      &.logos {
        background: red;

        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        flex-direction: column;
      }
      &.gifts {
        background: lightblue;
        display: flex;
        flex-direction: column;
        grid-column: 1 / 3;
      }

      &.parties {
        background: purple;

        grid-column: 3 / 4;
        grid-row: 1 / 3;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        flex-direction: column;
      }
    }

    @media screen and (max-width: 920px) {
      grid-template-columns: 1fr;
      .grid-item {
        grid-column: unset !important;
        grid-row: unset !important;
        justify-content: center !important;
        align-items: center !important;
      }
    }
  }
`;
