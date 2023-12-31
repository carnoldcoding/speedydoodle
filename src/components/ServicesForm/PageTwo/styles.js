import styled from "styled-components";
export const PageTwoStyles = styled.article`
  background: #222;
  width: 100%;
  box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.25);
  padding: 50px 15px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .form-wrapper {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3vw, 2rem);
    width: 90%;
  }
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: clamp(1.5rem, 3vw, 2rem);
  }
`;
