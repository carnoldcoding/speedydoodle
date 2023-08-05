import styled from "styled-components";

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  min-height: 100px;
  ul {
    position: absolute;
    right: 50px;
    display: flex;
    list-style: none;
    gap: 100px;
    li {
      font-size: ${(props) => props.theme.fontSizes.medium};
      a {
        color: white;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: ${(props) => props.theme.fontWeights.light};
        transition: color 0.2s ease;
        &:hover {
          color: ${(props) => props.theme.colors.primary};
        }
      }
    }
  }
`;
