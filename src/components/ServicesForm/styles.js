import styled from "styled-components";

export const ServicesFormStyles = styled.section`
  padding: ${(props) => props.theme.padding};
  position: relative;
  display: flex;
  justify-content: center;
  gap: 20px;
  color: white;
  .progress {
    display: flex;
    justify-content: space-evenly;
    list-style: none;
    max-width: 1000px;
    width: 1000px;
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
