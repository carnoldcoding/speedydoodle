import styled from "styled-components";
export const PageTwoStyles = styled.article`
  background: #222;
  width: 100%;
  box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.25);
  padding: 15px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 90%;
  }
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }
  .form-input {
    position: relative;
    flex: 1;
    input,
    label {
      font-size: ${(props) => props.theme.fontSizes.small};
    }
    ion-icon {
      position: absolute;
      right: 10px;
      font-size: 2rem;
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
      height: 50px;
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
          font-size: ${(props) => props.theme.fontSizes.xSmall};
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
  }
`;
