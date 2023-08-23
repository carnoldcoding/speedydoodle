import styled from "styled-components";

export const SelectFieldStyles = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  select {
    background: transparent;
    border: 2px solid grey;
    border-radius: 10px;
    height: 50px;
    padding: 0px 10px;
    padding-right: 50px;
    color: white;
    text-transform: capitalize;

    option {
      text-transform: capitalize;
    }
    width: 100%;
    &:valid {
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
    text-transform: capitalize;
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
