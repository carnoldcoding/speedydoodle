import styled from "styled-components";

export const CustomPricingBreakdownStyles = styled.article`
  max-width: ${(props) => props.theme.content.maxWidth};
  width: 100%;
  padding: ${(props) => props.theme.padding};
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  margin-top: -25px;
  header {
    margin-top: 10px;
    h1 {
      text-transform: uppercase;
      text-align: center;
      font-size: clamp(
        ${(props) => props.theme.fontSizes.small},
        3vw,
        ${(props) => props.theme.fontSizes.large}
      );
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
        gap: clamp(5px, 1vw, 10px);
        span {
          color: ${(props) => props.theme.colors.primary};
          font-size: clamp(1rem, 3vw, 2rem);
        }
        p {
          font-size: clamp(1rem, 3vw, 2rem);
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
      font-size: clamp(3rem, 10vw, 5rem);
      span {
        font-size: clamp(3rem, 10vw, 5rem);
        color: ${(props) => props.theme.colors.primary};
      }
    }
  }
`;

export const Icon = styled.article`
  align-self: center;
  ion-icon {
    align-self: center;
    font-size: clamp(2rem, 7vw, 4rem);
    border-radius: 50%;
    padding: clamp(20px, 3vw, 30px);
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
