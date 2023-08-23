import { SpotlightContainer } from "./styles";
import splash from "../../assets/splash.png";

const Spotlight = () => {
  return (
    <SpotlightContainer>
      <img alt="Michael Arnold" src={splash} />
      <article>
        <h2>multimedia caricature artist</h2>
        <h1>speedydoodle</h1>
      </article>
    </SpotlightContainer>
  );
};

export default Spotlight;
