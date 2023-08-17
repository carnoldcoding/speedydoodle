import { SpotlightContainer } from "./styles";
import splash from "../../assets/splash.png";

const Spotlight = () => {
  return (
    <SpotlightContainer>
      <img src={splash} />
      <article>
        <h2>multimedia caricature artist</h2>
        <h1>michael arnold</h1>
      </article>
    </SpotlightContainer>
  );
};

export default Spotlight;
