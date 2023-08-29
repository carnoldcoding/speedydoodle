import styled from "styled-components";

export const DetailStyles = styled.article`
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
  h1 {
    font-size: clamp(1.25rem, 3vw, 2rem);
    font-weight: 300;
  }
`;
