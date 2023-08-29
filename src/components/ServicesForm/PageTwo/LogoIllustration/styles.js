import styled from "styled-components";
export const LogoIllustrationStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media screen and (max-width: 822px) {
    flex-wrap: wrap;
  }
  .line {
    height: 2px;
    width: 100%;
    background: white;
  }
  .lni-wrapper {
    width: 100%;
    height: 100%;
    border: 2px solid grey;
    padding: 20px;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  article {
    position: relative;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    transition: all 0.2s ease;
    &:hover {
      cursor: pointer;
      border-color: white;
    }

    input {
      appearance: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      border-radius: unset;
      &:hover {
        cursor: pointer;
      }
      &:checked {
        & + div {
          border-color: white;
        }
      }
    }
    header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      h1,
      h2,
      h3 {
        text-transform: uppercase;
      }
      h2 {
        font-size: clamp(
          ${(props) => props.theme.fontSizes.medium},
          3vw,
          ${(props) => props.theme.fontSizes.large}
        );
      }
      h3 {
        font-size: clamp(
          ${(props) => props.theme.fontSizes.xSmall},
          2vw,
          ${(props) => props.theme.fontSizes.small}
        );
        color: ${(props) => props.theme.colors.primary};
        font-weight: 400;
        margin-bottom: 20px;
      }
      h1 {
        font-size: clamp(3.5rem, 9vw, 5rem);
        position: relative;
        &::before {
          content: "FROM";
          position: absolute;
          top: -12px;
          left: 0;
          font-size: 1rem;
          font-weight: 300;
        }
        span {
          font-size: ${(props) => props.theme.fontSizes.medium};
          text-transform: lowercase;
        }
      }
    }
    .information {
      width: 100%;
      ul {
        padding: 10px;
        list-style: none;
        li {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 7.5px 0;
          font-size: 1.1rem;
          ion-icon {
            font-size: 1.5rem;
            color: ${(props) => props.theme.colors.primary};
          }
        }
      }
    }
  }
`;
