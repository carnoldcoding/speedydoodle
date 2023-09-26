import styled from "styled-components";

export const InputFieldStyles = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  input,
  label {
    font-size: clamp(
      ${(props) => props.theme.fontSizes.xSmall},
      3vw,
      ${(props) => props.theme.fontSizes.small}
    );
  }
  ion-icon {
    position: absolute;
    right: 10px;
    font-size: clamp(1.5rem, 3vw, 2rem);
    top: 50%;
    transform: translateY(-50%);
    &#valid {
      color: ${(props) => props.theme.colors.valid};
      display: none;
    }
    &#invalid {
      color: ${(props) => props.theme.colors.invalid};
    }
  }
  input {
    background: transparent;
    border: 2px solid grey;
    border-radius: 10px;
    height: clamp(40px, 8vw, 50px);
    padding: 0px 10px;
    padding-right: 50px;
    color: white;
    width: 100%;
    &:not(:placeholder-shown),
    &:focus {
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
