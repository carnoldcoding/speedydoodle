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
    min-height: 100dvh;
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
      max-width: 90%;
      max-height: 90%;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;

      &:hover {
        cursor: pointer;
      }
    }
  }
  
  article {
    max-width: 1250px;
    width: 100%;
    padding: 2rem;
    position: relative;
    
    @media screen and (max-width: 920px) {
      padding: 1rem;
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 100px;
      background: #222;
      z-index: 2;
      padding: 25px;
      gap: 2rem;
      flex-wrap: wrap;
      
      @media screen and (max-width: 920px) {
        position: relative;
        top: 0;
      }
      
      .filter-section {
        flex: 1;
        min-width: 200px;
        
        ul {
          display: flex;
          justify-content: center;
          gap: 2rem;
          list-style: none;
          text-transform: uppercase;
          flex-wrap: wrap;
          
          @media screen and (max-width: 920px) {
            display: none;
          }
          
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
              background: #b42401;
              transform: scaleX(0);
              transition: all 0.2s ease;
              transform-origin: left;
            }
          }
        }
        
        select {
          display: none;
          height: 45px;
          width: 100%;
          max-width: 250px;
          padding-left: 10px;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 300;
          background: #333;
          color: white;
          border: 1px solid white;
          
          @media screen and (max-width: 920px) {
            display: block;
          }
          
          &:active {
            border-color: #b42401;
          }
        }
      }
      
      .view-controls {
        display: flex;
        gap: 0.5rem;
        position: absolute;
        right: 25px;
        
        @media screen and (max-width: 920px) {
          position: static;
        }
        
        button {
          background: #333;
          border: 1px solid white;
          color: white;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 45px;
          height: 45px;
          
          &:hover {
            background: #444;
          }
          
          &.active {
            background: #b42401;
            border-color: #b42401;
          }
          
          ion-icon {
            font-size: 1.5rem;
            pointer-events: none;
          }
        }
      }
    }
    
    .gallery-container {
      margin-top: 50px;
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      
      @media screen and (max-width: 920px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
      
      .image-card {
        text-align: center;
        color: white;
        height: 250px;
        width: 100%;
        border-radius: 5px;
        background: #111;
        border: 1px solid white;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        
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
          border-color: #b42401;
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
    
    .gallery-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
      
      .image-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        color: white;
        height: auto;
        width: 100%;
        padding: 1rem;
        border-radius: 5px;
        background: #111;
        border: 1px solid white;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        
        .thumbnail {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          background: #222;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        
        .image-name {
          flex: 1;
          font-size: 1.1rem;
          text-align: left;
          text-transform: capitalize;
        }
        
        ion-icon {
          font-size: 1.5rem;
          transition: all 0.2s ease;
          color: white;
        }
        
        &:hover {
          cursor: pointer;
          border-color: #b42401;
          transform: translateX(5px);
          box-shadow: 0 5px 8px rgba(180, 36, 1, 0.4);
          
          ion-icon {
            color: #b42401;
          }
        }
      }
    }
    
    .gallery-carousel {
      position: relative;
      margin-bottom: 50px;
      
      .embla {
        overflow: hidden;
        
        .embla__container {
          display: flex;
          width: 90dvw;
          height: 90dvw;
          position: relative;
          
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
      
      aside {
        position: relative;
        margin-top: 20px;
        width: 100%;
        padding: 10px;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
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
          color: #b42401;
        }
      }
    }
    
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      border-radius: 50%;
      height: 100px;
      width: 100px;
      position: relative;
      margin: 50px auto;
      
      &::before {
        @keyframes spin {
          from {
            transform: rotate(0deg);
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
        content: "loading";
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
  }
`;
