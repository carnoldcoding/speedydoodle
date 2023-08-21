import styled from "styled-components";

export const ServicesFormStyles = styled.section`
  padding: ${(props) => props.theme.padding};
  position: relative;
  display: flex;
  justify-content: center;
  gap: 20px;
  color: white;
  padding-bottom: 200px;
  .wrapper {
    max-width: ${(props) => props.theme.content.maxWidth};
    position: relative;
  }
  .controls {
    display: flex;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    position: absolute;
    bottom: -150px;
    button {
      outline: 0;
      height: 50px;
      min-width: 150px;
      font-size: 1.5rem;
      background: transparent;
      text-transform: uppercase;
      font-weight: 700;
      transition: all 0.2s ease;
      &.primary {
        background: ${(props) => props.theme.colors.primary};
        color: white;
        border: unset;
        &:hover {
          cursor: pointer;
          background: ${(props) => props.theme.colors.primary};
          color: white;
        }
      }
      &.secondary {
        border: 3px solid ${(props) => props.theme.colors.primary};
        color: ${(props) => props.theme.colors.primary};
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .progress {
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    max-width: 1000px;
    width: clamp(300px, 60vw, 1000px);
    @media screen and (max-width: ${(props) => props.theme.mobile}) {
      li > h3 {
        display: none;
      }
    }
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 50px;
      width: 50px;
      background: white;
      border-radius: 50%;
      &.active {
        background: ${(props) => props.theme.colors.primary};
        h1 {
          color: white;
        }
      }
      h3 {
        color: white;
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        text-transform: uppercase;
        white-space: nowrap;
      }
      h1 {
        color: black;
      }
    }
  }
`;
