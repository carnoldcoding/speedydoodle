import styled from "styled-components";

export const DateFieldStyles = styled.article`
  position: relative;
  flex: 1;
  min-width: 250px;
  .react-datepicker-wrapper {
    width: 100%;
  }
  input {
    background: transparent;
    border: 2px solid grey;
    border-radius: 10px;
    height: 50px;
    padding: 0px 10px;
    padding-right: 50px;
    padding-left: 80px;
    color: grey;
    width: 100%;
    font-size: ${(props) => props.theme.fontSizes.small};
    transition: all 0.2s ease;

    &.chosen {
      border-color: white;
      color: white;
      padding-left: 10px;
    }
  }
  label {
    position: absolute;
    text-transform: capitalize;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: #222;
    padding: 0 10px;
    transition: all 0.2s ease;
    color: grey;
    pointer-events: none;
    &.chosen {
      top: 0;
      left: 15px;
      color: white;
      font-size: ${(props) => props.theme.fontSizes.xSmall};
      border-left: 2px solid white;
      border-right: 2px solid white;
    }
  }
`;
