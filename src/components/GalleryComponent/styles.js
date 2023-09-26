import styled from "styled-components";

export const GallerySection = styled.section`
  display: flex;
  justify-content: center;
  background: #222;
  .zoom-image {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 60px;
    height: 100dvh;
    width: 100dvw;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

    &.visible {
      opacity: 1;
      pointer-events: all;
    }

    img {
      height: 80dvh;
      width: auto;
      object-fit: contain;
      &:hover {
        cursor: pointer;
      }
    }
  }
  article {
    max-width: 1250px;
    padding: ${(props) => props.theme.padding};
    .carousel {
      max-width: 90dvw;
      .carousel-card {
        img {
          object-fit: contain;
        }
      }
    }
    .mobile-gallery {
      position: relative;
      margin-bottom: 50px;
      @media screen and (min-width: 920px) {
        display: none;
      }
      aside {
        position: absolute;
        width: 100%;
        padding: 10px;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        bottom: -45px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
        gap: 2rem;
        ion-icon {
          font-size: 1.5rem;
          color: ${(props) => props.theme.colors.primary};
        }
      }
      .embla {
        overflow: hidden;
        .embla__container {
          display: flex;
          width: 90dvw;
          height: 90dvw;
          position: relative;
          p {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
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
                  transform: rotate(360deg);
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
              background: linear-gradient(to right, transparent 10%, red);
            }
            &::after {
              position: absolute;
              content: "~loading~";
              display: flex;
              justify-content: center;
              align-items: center;
              left: 0;
              top: 0;
              inset: 4px;
              border-radius: 50%;
              background: #222;
            }
          }
          .embla__slide {
            flex: 0 0 100%;
            img {
              height: 100%;
              width: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }

    .gallery-images {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
      margin-top: 50px;
      @media screen and (max-width: 920px) {
        display: none;
      }
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
              transform: rotate(360deg);
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
          background: linear-gradient(to right, transparent 10%, red);
        }
        &::after {
          position: absolute;
          content: "~loading~";
          display: flex;
          justify-content: center;
          align-items: center;
          left: 0;
          top: 0;
          inset: 4px;
          border-radius: 50%;
          background: #222;
        }
      }
      .image-card {
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
        &.zoom {
          height: 90dvw;
          width: 90dvw;
        }
        &::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0;
          transition: all 0.2s ease;
          pointer-events: none;
        }
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
          z-index: 1;
          pointer-events: none;
        }
        &:hover {
          cursor: pointer;
          border-color: ${(props) => props.theme.colors.primary};
          transform: translateY(-5px);
          box-shadow: 0 5px 8px rgba(180, 36, 1, 0.4);
          &::after {
            opacity: 1;
          }
          ion-icon {
            transform: translateX(0);
          }
        }
      }
    }
    header {
      display: flex;
      justify-content: center;
      position: sticky;
      @media screen and (max-width: ${(props) => props.theme.mobile}) {
        position: relative;
        top: 0;
      }
      top: 100px;
      background: #222;
      z-index: 2;
      padding: 25px;
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
          position: relative;
          color: white;
          &:hover {
            cursor: pointer;
          }
          &.active {
            &::after {
              transform: scaleX(1);
            }
          }
          &::after {
            position: absolute;
            content: "";
            height: 3px;
            width: 100%;
            bottom: -5px;
            left: 0;
            background: ${(props) => props.theme.colors.primary};
            transform: scaleX(0);
            transition: all 0.2s ease;
            transform-origin: left;
          }
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
