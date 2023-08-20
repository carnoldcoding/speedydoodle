import styled from "styled-components";

export const ServicesHeaderStyles = styled.header`
  padding: ${(props) => props.theme.padding};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    color: white;
    font-size: clamp(3.8rem, 10vw, 10rem);
    text-transform: uppercase;
  }
  h3 {
    color: ${(props) => props.theme.colors.primary};
    text-transform: uppercase;
    font-weight: 400;
    font-size: clamp(0.8rem, 3vw, 1.4rem);
  }
`;
