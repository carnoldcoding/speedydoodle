import styled from "styled-components";

export const GallerySection = styled.section`
  display: flex;
  justify-content: center;
  background: #222;
  article {
    max-width: 1250px;
    padding: ${(props) => props.theme.padding};
    .gallery-images {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
      margin-top: 50px;
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        border-radius: 50%;
        height: 100px;
        width: 100px;
        position: relative;
        &::before {
          @keyframes spin {
            from {
              transform: rotate();
            }
            to {
              transform: rotate(180deg);
            }
          }

          position: absolute;
          content: "";
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          background: linear-gradient(
            to right,
            transparent 10%,
            red,
            transparent 90%
          );
        }
        &::after {
          position: absolute;
          content: "~loading~";
          display: flex;
          justify-content: center;
          align-items: center;
          left: 0;
          top: 0;
          inset: 2px;
          border-radius: 50%;
          background: #222;
        }
      }
      .image-card {
        background: pink;
        text-align: center;
        color: white;
        height: 300px;
        width: 250px;
        border-radius: 10px;
        background: #111;
        border: 1px solid white;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        ion-icon {
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 2rem;
          transform: translateX(50px);
          transition: all 0.2s ease;
        }
        &:hover {
          cursor: pointer;
          border-color: ${(props) => props.theme.colors.primary};
          transform: translateY(-5px);
          box-shadow: 0 5px 8px rgba(180, 36, 1, 0.4);
          ion-icon {
            transform: translateX(0);
          }
        }
      }
    }
    header {
      display: flex;
      justify-content: center;
      ul {
        @media screen and (max-width: 920px) {
          display: none;
        }
        display: flex;
        justify-content: center;
        gap: 2rem;
        list-style: none;
        text-transform: uppercase;
        li {
          color: white;
        }
      }
      select {
        @media screen and (min-width: 920px) {
          display: none;
        }
        height: 50px;
        width: 200px;
        font-size: 1rem;
        text-transform: capitalize;
        font-weight: 300;
        background: #333;
        color: white;
        border: 1px solid;
        border-color: white;
        &:active {
          border-color: ${(props) => props.theme.colors.primary};
        }
      }
    }
  }
`;
