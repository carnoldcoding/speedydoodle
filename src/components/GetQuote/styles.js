import styled from "styled-components";

export const GetQuoteSection = styled.section`
  height: 300px;
  padding: ${(props) => props.theme.padding};
  background: #222;
  article {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    header {
      text-align: center;
      text-transform: capitalize;
      h3 {
        font-size: ${(props) => props.theme.fontSizes.small};
        color: ${(props) => props.theme.colors.primary};
      }
      h1 {
        color: white;
        font-size: clamp(
          ${(props) => props.theme.fontSizes.medium},
          3vw,
          ${(props) => props.theme.fontSizes.large}
        );
      }
    }
    button {
      border: none;
      color: white;
      background: ${(props) => props.theme.colors.primary};
      padding: 10px 20px;
      font-size: clamp(1rem, 3vw, 1.3rem);
      text-transform: uppercase;
      font-weight: 700;
      position: relative;
      &::after {
        content: "";
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: all 0.2s ease;
      }
      &:hover {
        cursor: pointer;
        &::after {
          opacity: 1;
        }
      }
    }
  }
`;
