import styled from "styled-components";

export const CommissionTypeStyles = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 2rem);
  margin-top: 50px;
  max-width: 400px;
  .radio-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: clamp(
      ${(props) => props.theme.fontSizes.xSmall},
      3vw,
      ${(props) => props.theme.fontSizes.small}
    );
    font-weight: 700;
    letter-spacing: 1px;
    padding: 0px 15px;
    background: #222;
    box-shadow: 0 5px 7px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    transition: all 0.2s ease;
    &:hover {
      cursor: pointer;
      transform: translateY(-5px);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.6);
    }
    label {
      text-transform: uppercase;
      cursor: pointer;
      width: 100%;
      padding: 12px;
    }
    input {
      appearance: none;
      height: clamp(15px, 3vw, 25px);
      width: clamp(15px, 3vw, 25px);
      background: transparent;
      position: relative;
      border-radius: 50%;
      background: transparent;
      border: 2px solid white;
      &:hover {
        cursor: pointer;
      }
      &:checked {
        background-color: ${(props) => props.theme.colors.valid};
        border: 2px solid ${(props) => props.theme.colors.valid};
      }
    }
  }
`;
