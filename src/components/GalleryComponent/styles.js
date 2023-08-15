import styled from "styled-components";

export const GallerySection = styled.section`
  display: flex;
  justify-content: center;
  background: #222;
  article {
    max-width: ${(props) => props.theme.content.maxWidth};
    padding: ${(props) => props.theme.padding};
    header {
      ul {
        @media screen and (max-width: 920px) {
          display: none;
        }
        display: flex;
        justify-content: center;
        gap: 2rem;
        list-style: none;
        text-transform: uppercase;
        li {
          color: white;
        }
      }
      select {
        @media screen and (min-width: 920px) {
          display: none;
        }
        height: 50px;
        width: 200px;
        font-size: 1rem;
        text-transform: capitalize;
        font-weight: 300;
        background: #333;
        color: white;
        border: 1px solid;
        border-color: white;
        &:active {
          border-color: ${(props) => props.theme.colors.primary};
        }
      }
    }
  }
`;
