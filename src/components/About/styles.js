import styled from "styled-components";

export const AboutSection = styled.section`
  padding: ${(props) => props.theme.padding};
  display: flex;
  justify-content: center;
  .about-wrapper {
    display: flex;
    justify-content: center;
    max-width: ${(props) => props.theme.content.maxWidth};
    article {
      flex-basis: 50%;
      @media screen and (max-width: ${(props) => props.theme.mobile}) {
        flex-basis: unset;
      }
      &.intro {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        h3 {
          position: relative;
          color: ${(props) => props.theme.colors.primary};
          &::after {
            content: "";
            position: absolute;
            height: 2px;
            width: 40px;
            background: ${(props) => props.theme.colors.primary};
            top: 50%;
            transform: translateY(-50%);
            margin-left: 10px;
          }
        }
        h1 {
          color: white;
          font-size: clamp(
            ${(props) => props.theme.fontSizes.medium},
            3vw,
            ${(props) => props.theme.fontSizes.large}
          );
        }
        p {
          color: white;
          line-height: 1.5rem;
        }
        .about-experience {
          display: flex;
          align-items: center;
          gap: 10px;
          h1 {
            color: ${(props) => props.theme.colors.primary};
            font-size: ${(props) => props.theme.fontSizes.xLarge};
          }
          h3 {
            color: white;
            font-size: ${(props) => props.theme.fontSizes.small};
            max-width: 100px;
            &::after {
              display: none;
            }
          }
        }
        .intro-footer {
          display: flex;
          justify-content: space-between;
          button {
            outline: 0;
            border: 3px solid ${(props) => props.theme.colors.primary};
            color: ${(props) => props.theme.colors.primary};
            height: 50px;
            min-width: 150px;
            font-size: 1.1rem;
            background: transparent;
            text-transform: uppercase;
            font-weight: 700;
            transition: all 0.2s ease;
            &:hover {
              cursor: pointer;
              background: ${(props) => props.theme.colors.primary};
              color: white;
            }
          }
        }
      }
    }
  }
`;
