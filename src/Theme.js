import { ThemeProvider } from "styled-components";

const generalTheme = {
  colors: {
    primary: "#B42401",
    darkBG: "#1C1C1C",
    mainBG: "222222",
  },
  fontSizes: {
    xLarge: "3.05rem",
    large: "2.4rem",
    medium: "1.7rem",
    small: "1rem",
    xSmall: ".8rem",
  },
  fontWeights: {
    light: "300",
    medium: "500",
    heavy: "700",
  },
};

export default function Theme({ children }) {
  return <ThemeProvider theme={generalTheme}>{children}</ThemeProvider>;
}
