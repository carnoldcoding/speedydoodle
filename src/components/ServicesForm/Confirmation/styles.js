import styled from "styled-components";

export const ConfirmationStyles = styled.section`
  background: #222;
  width: 100%;
  box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.25);
  padding: 50px;
  @media screen and (max-width: 400px) {
    padding: 30px 15px;
  }
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 50px;

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: clamp(2.5rem, 7vw, 4rem);
      text-transform: uppercase;
    }
    h2 {
      font-size: clamp(1rem, 3vw, 2rem);
      font-weight: 400;
      text-transform: uppercase;
      color: ${(props) => props.theme.colors.primary};
    }
    h3 {
      font-weight: 300;
      font-style: italic;
      text-transform: uppercase;
      font-size: clamp(0.6rem, 3vw, 1rem);
      margin-top: 10px;
    }
  }

  .line {
    height: 2px;
    width: 100%;
    background: white;
  }

  article {
    h1 {
      font-size: clamp(1rem, 3vw, 2rem);
      text-transform: uppercase;
    }
  }
`;
