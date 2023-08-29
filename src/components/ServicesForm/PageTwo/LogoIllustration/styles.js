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
  article {
    height: 400px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    border: 2px solid grey;
    border-radius: 10px;
    width: 100%;
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
          top: -10px;
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
