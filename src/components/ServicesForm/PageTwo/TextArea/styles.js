import styled from "styled-components";

export const TextAreaStyles = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  textarea,
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
    font-size: 2rem;
    top: 30px;
    transform: translateY(-50%);
    &#valid {
      color: ${(props) => props.theme.colors.valid};
      display: none;
    }
    &#invalid {
      color: ${(props) => props.theme.colors.invalid};
    }
  }
  textarea {
    background: transparent;
    border: 2px solid grey;
    border-radius: 10px;
    min-height: 150px;
    padding: 0px 10px;
    padding-right: 50px;
    padding-top: 10px;
    color: white;
    overflow-y: unset;
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
    top: 30px;
    transform: translateY(-50%);
    background: #222;
    padding: 0 10px;
    transition: all 0.2s ease;
    color: grey;
    pointer-events: none;
  }
`;
