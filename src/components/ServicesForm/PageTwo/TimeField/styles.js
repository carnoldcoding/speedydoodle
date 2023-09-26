import styled from "styled-components";

export const DateFieldStyles = styled.article`
  position: relative;
  flex: 1;
  min-width: 250px;
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker--time-only {
    min-width: 200px;
    display: flex;
  }

  .react-datepicker__time {
    &-container {
      width: 100%;
    }
    &-box {
      width: unset !important;
      background: #222;
    }
    &-list {
      &-item {
        font-size: 1.25rem;
        height: unset !important;
        padding: 10px 5px !important;
        color: white;
        &--selected {
          background: ${(props) => props.theme.colors.primary} !important;
        }

        &:hover {
          @media screen and (max-width: ${(props) => props.theme.mobile}) {
            background: transparent !important;
          }
          background: ${(props) => props.theme.colors.primary} !important;
        }
      }
    }
  }

  .react-datepicker__header--time {
    background: #333;
    width: 100%;
    div {
      color: white;
    }
  }
  input {
    background: transparent;
    border: 2px solid grey;
    border-radius: 10px;
    height: clamp(40px, 8vw, 50px);
    padding: 0px 10px;
    padding-right: 50px;
    padding-left: 120px;
    color: grey;
    width: 100%;
    font-size: clamp(
      ${(props) => props.theme.fontSizes.xSmall},
      3vw,
      ${(props) => props.theme.fontSizes.small}
    );
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
    font-size: clamp(
      ${(props) => props.theme.fontSizes.xSmall},
      3vw,
      ${(props) => props.theme.fontSizes.small}
    );
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
      font-size: clamp(0.7rem, 2vw, ${(props) => props.theme.fontSizes.xSmall});
      border-left: 2px solid white;
      border-right: 2px solid white;
    }
  }
`;
