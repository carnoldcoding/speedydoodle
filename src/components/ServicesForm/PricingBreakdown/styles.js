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
    h3 {
      color: ${(props) => props.theme.colors.primary};
      text-transform: uppercase;
    }
    h1 {
      font-size: ${(props) => props.theme.fontSizes.xLarge};
      span {
        font-size: ${(props) => props.theme.fontSizes.xLarge};
        color: ${(props) => props.theme.colors.primary};
      }
    }
  }
`;
