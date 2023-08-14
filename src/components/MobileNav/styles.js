import styled from "styled-components";
export const MobileNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1;
  background: ${(props) => props.theme.colors.navBG};
  ion-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: ${(props) => props.theme.fontSizes.large};
    color: white;
  }
  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    text-transform: uppercase;
    min-height: 100dvh;
    width: 100%;
    background: ${(props) => props.theme.colors.navBG};
    li {
      a {
        text-decoration: none;
        color: white;
        font-size: ${(props) => props.theme.fontSizes.large};
        font-weight: ${(props) => props.theme.fontWeights.light};
        &:active {
          color: ${(props) => props.theme.colors.primary};
        }
      }
    }
  }
`;
