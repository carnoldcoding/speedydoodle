import styled from "styled-components";

export const LocationFieldStyles = styled.article`
  position: relative;
  flex: 1;
  min-width: 250px;
  .dropdown {
    position: relative;
    z-index: 1;
    border: 2px solid white;
    border-top: unset;
    margin-top: -7px;
    background: #222;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    font-size: ${(props) => props.theme.fontSizes.small};
    padding: 5px 0px;
    p {
      padding: 5px 10px;
      &:hover {
        background: #111;
        color: ${(props) => props.theme.colors.primary};
        cursor: pointer;
      }
    }
    &.inactive {
      display: none;
    }
  }
  input {
    background: transparent;
    position: relative;
    z-index: 0;
    border: 2px solid grey;
    border-radius: 10px;
    height: 50px;
    padding: 0px 10px;
    padding-right: 50px;
    color: white;
    width: 100%;
    font-size: ${(props) => props.theme.fontSizes.small};
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
    font-size: ${(props) => props.theme.fontSizes.small};

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
