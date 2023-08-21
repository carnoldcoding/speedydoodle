import { ThemeProvider } from "styled-components";

const generalTheme = {
  mobile: "920px",
  content: {
    maxWidth: "1000px",
  },
  colors: {
    primary: "#B42401",
    darkBG: "#1C1C1C",
    mainBG: "222222",
    navBG: "#010101",
    valid: "#169C00",
    invalid: "#e74c3c",
  },
  fontSizes: {
    xLarge: "3.05rem",
    large: "2.4rem",
    medium: "1.7rem",
    small: "1.2rem",
    xSmall: ".8rem",
  },
  fontWeights: {
    light: "300",
    medium: "500",
    heavy: "700",
  },
  padding: "clamp(15px, 3vw, 50px)",
};

export default function Theme({ children }) {
  return <ThemeProvider theme={generalTheme}>{children}</ThemeProvider>;
}
