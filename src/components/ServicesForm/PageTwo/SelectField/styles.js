import styled from "styled-components";

export const SelectFieldStyles = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  ion-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: grey;
  }
  select {
    background: transparent;
    appearance: none;
    border: 2px solid grey;
    border-radius: 10px;
    height: clamp(40px, 8vw, 50px);
    padding: 0px 10px;
    padding-right: 50px;
    color: white;
    text-transform: capitalize;
    font-size: clamp(
      ${(props) => props.theme.fontSizes.xSmall},
      3vw,
      ${(props) => props.theme.fontSizes.small}
    );

    option {
      text-transform: capitalize;
      background: #222;
      font-size: clamp(
        ${(props) => props.theme.fontSizes.xSmall},
        3vw,
        ${(props) => props.theme.fontSizes.small}
      );
    }
    width: 100%;
    &:valid {
      border-color: white;
      & + label {
        top: 0;
        left: 15px;
        color: white;
        font-size: clamp(
          0.7rem,
          2vw,
          ${(props) => props.theme.fontSizes.xSmall}
        );
        border-left: 2px solid white;
        border-right: 2px solid white;
      }
    }
  }
  label {
    position: absolute;
    text-transform: capitalize;
    font-size: clamp(
      ${(props) => props.theme.fontSizes.xSmall},
      3vw,
      ${(props) => props.theme.fontSizes.small}
    );

    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: #222;
    padding: 0 10px;
    transition: all 0.2s ease;
    color: grey;
    pointer-events: none;
  }
`;
