import styled from "styled-components";
import logoImage from "../../assets/logo.png";

export const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.colors.navBG};
  padding: 0px ${(props) => props.theme.padding};
  width: 100%;
  min-height: 100px;
  z-index: 99;
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
    gap: 2.5rem;
    li {
      font-size: clamp(
        ${(props) => props.theme.fontSizes.xSmall},
        2vw,
        ${(props) => props.theme.fontSizes.small}
      );
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
