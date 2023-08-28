import styled from "styled-components";

export const PricingBreakdownStyles = styled.article`
  max-width: ${(props) => props.theme.content.maxWidth};
  width: 100%;
  padding: ${(props) => props.theme.padding};
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  margin-top: -25px;
  header {
    h1 {
      text-transform: uppercase;
      text-align: center;
      font-size: ${(props) => props.theme.fontSizes.large};
    }
  }
  span,
  p {
    font-size: ${(props) => props.theme.fontSizes.medium};
  }
  .breakdowns {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
    .breakdown {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      gap: 1rem;
      .variable {
        display: flex;
        gap: 10px;
        span {
          color: ${(props) => props.theme.colors.primary};
        }
        p {
          text-transform: capitalize;
        }
      }
    }
  }

  .total {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h3 {
      color: ${(props) => props.theme.colors.primary};
      text-transform: uppercase;
    }
    h1 {
      font-size: 5rem;
      span {
        font-size: 5rem;
        color: ${(props) => props.theme.colors.primary};
      }
    }
  }
`;

export const Icon = styled.article`
  ion-icon {
    align-self: center;
    font-size: 4rem;
    border-radius: 50%;
    padding: 30px;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      background: #222;
      border-radius: 50%;
      inset: 5px;
      z-index: -1;
    }
    &::before {
      position: absolute;
      z-index: -1;
      content: "";
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: conic-gradient(
        from 0deg,
        ${(props) => props.theme.colors.primary} 0%,
        ${(props) => props.theme.colors.primary} 0% ${(props) => props.percent},
        white ${(props) => props.percent},
        white 100%
      );
    }
  }
`;
