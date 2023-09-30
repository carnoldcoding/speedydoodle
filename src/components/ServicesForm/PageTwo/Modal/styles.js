import styled from "styled-components";

export const ModalStyles = styled.div`
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    .modal-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #333;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
      border-radius: 5px;
      width: 92vw;
      max-width: 520px;
      padding: 25px;
      padding-top: 35px;
      p {
        padding: 5px;
        padding-left: 25px;
        line-height: 1.5em;
        font-weight: 300;
      }
      details {
        padding: 10px;
        summary {
          &:hover {
            cursor: pointer;
            color: ${(props) => props.theme.colors.primary};
          }
        }
      }
      ion-icon {
        position: absolute;
        top: 0;
        right: 10px;
        top: 10px;
        font-size: 1.5rem;
        &:hover {
          cursor: pointer;
          color: ${(props) => props.theme.colors.primary};
        }
      }
      h1 {
        text-transform: uppercase;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 25px;
      }
    }
  }
`;
