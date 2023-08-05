import styled from "styled-components";
import logoImage from "../../assets/logo.png";

export const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px ${(props) => props.theme.padding};
  position: fixed;
  width: 100%;
  min-height: 100px;
  .logo {
    background: url(${logoImage});
    background-repeat: no-repeat;
    background-size: contain;
    height: 80px;
    width: 300px;
  }
  ul {
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
