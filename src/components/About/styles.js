import styled from "styled-components";

export const AboutSection = styled.section`
  padding: ${(props) => props.theme.padding};
  display: flex;
  justify-content: center;
  background: #222;
  .about-wrapper {
    display: flex;
    gap: 3rem;
    @media screen and (max-width: ${(props) => props.theme.mobile}) {
      flex-direction: column;
    }
    max-width: ${(props) => props.theme.content.maxWidth};
    article {
      margin-top: 25px;
      flex-basis: 50%;
      @media screen and (max-width: ${(props) => props.theme.mobile}) {
        flex-basis: unset;
      }
      &.testimonials {
        position: relative;
        h3 {
          position: absolute;
          top: -25px;
          right: 0;
          color: ${(props) => props.theme.colors.primary};
          &::before {
            content: "";
            position: absolute;
            height: 2px;
            width: 40px;
            background: ${(props) => props.theme.colors.primary};
            top: 50%;
            left: -60px;
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
        i {
          color: ${(props) => props.theme.colors.primary};
          font-size: 5rem;
          transform: scaleX(-1);
        }
        .quote-carousel {
          display: flex;
          overflow: hidden;
          p {
            color: white;
            min-width: 100%;
            font-style: italic;
            padding-left: 30px;
          }
        }
      }
      &.intro {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        header {
          position: relative;
        }
        h3 {
          position: absolute;
          top: -25px;
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
            position: unset;
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
