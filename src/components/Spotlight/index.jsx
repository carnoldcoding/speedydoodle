import { SpotlightContainer } from "./styles";
import splash from "../../assets/splash.png";

const Spotlight = () => {
  return (
    <SpotlightContainer>
      <img alt="Michael Arnold" src={splash} />
      <article>
        <h1>speedydoodle</h1>
        <h2>studios</h2>
        <p>South Jersey &bull; Philadelphia &bull; Delaware</p>
      </article>
    </SpotlightContainer>
  );
};

export default Spotlight;
