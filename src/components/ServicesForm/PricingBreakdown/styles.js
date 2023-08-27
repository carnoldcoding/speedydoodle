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
    ion-icon {
      align-self: center;
      font-size: 4rem;
      border-radius: 50%;
      border: 5px solid white;
      padding: 25px;
    }
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
