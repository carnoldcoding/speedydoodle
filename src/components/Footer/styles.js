import styled from "styled-components";

export const FooterSection = styled.footer`
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 80px;
  background: ${(props) => props.theme.colors.navBG};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px ${(props) => props.theme.padding};
  @media screen and (max-width: ${(props) => props.theme.mobile}) {
    height: 150px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  h2 {
    color: ${(props) => props.theme.colors.primary};
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    span {
      color: white;
    }
  }
  aside {
    display: flex;
    gap: 1rem;
    ion-icon {
      color: white;
      font-size: clamp(2.5rem, 3vw, 3rem);
      transition: all 0.2s ease;
      &:hover {
        cursor: pointer;
        color: ${(props) => props.theme.colors.primary};
        transform: translateY(-5px);
      }
    }
  }
`;
