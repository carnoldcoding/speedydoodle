import styled from "styled-components";
export const SpotlightContainer = styled.section`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
  position: relative;
  gap: 2rem;
  @media screen and (max-width: ${(props) => props.theme.mobile}) {
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-start;
  }

  img {
    height: auto;
    width: clamp(400px, 45vw, 550px);
  }

  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    h1,
    h2 {
      text-transform: uppercase;
    }
    h2 {
      color: white;
      background: ${(props) => props.theme.colors.primary};
      font-weight: ${(props) => props.theme.fontWeights.light};
      letter-spacing: 1px;
      padding: 0px 10px;
      font-size: clamp(
        ${(props) => props.theme.fontSizes.xSmall},
        1.3vw,
        ${(props) => props.theme.fontSizes.small}
      );
    }
    h1 {
      color: white;
      font-size: clamp(2rem, 3vw, ${(props) => props.theme.fontSizes.xLarge});
    }
  }
`;
