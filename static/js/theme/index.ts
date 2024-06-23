import { extendTheme } from "@chakra-ui/react";

import Alert from "./components/Alert";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import Input from "./components/Input";
import Menu from "./components/Menu";
import Progress from "./components/Progress";
import Tooltip from "./components/Tooltip";

const theme = extendTheme({
  fonts: {
    heading: `'Roobert', sans-serif`,
    body: `'Roobert', sans-serif`,
    v2: {
      heading: `'DM Sans Variable', sans-serif`,
      body: `'DM Sans Variable', sans-serif`,
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  // @TODO - Rename color variables after launch
  colors: {
    brand: {
      primary: "#1A271E", // Background / Purple - Accent 1
      secondary: "#102316", //Purple - Secondary
      green: "#6CBF5E", // Green accent - prev. Pink Accent
      orange: "#E48C23",
      blue: "#77C8B4", //Cian Accent
      red: "#FF3D3D",
      gray: "#828282",
      google: "#4285F4",
      twitter: "#1D9BF0",
      discord: "#5865F2",
    },
    green: {
      100: "#A9D4B6", // Teal Darker
      200: "#2E583C", //Teal Darker 2
      quiet: {
        button: "#2D533B",
      },
      accent: {
        1: "#7BA588", // Purple - Accent - 1
        3: "#27763F", // Purple - Accent - 3
        100: "#8F66FF",
        200: "#A9D4B6", //Black - Purple 50%
        300: "#102316", // Purple - Main
        400: "#141124",
        500: "#40674D", // Purple- Dialogs BG
        600: "#478C5C", //Purple - Accent
      },
      white: {
        100: "#D8EBE0", //55%  | Purple White
        200: "#ECEBFA",
        300: "#9393B5",
        400: "#C2E4CD", // white 90%
      },
      black: {
        100: "#A9D4B6", //Black - Purple 70%
      },
    },
    red: {
      500: "#E53E3E",
    },
    gray: {
      100: "#ECEBF5",
      200: "#A8A6BF",
    },
    white: "#EBF2EC", //White - Full
    dash: {
      background: "#1D201F", //Dash - Background
      card: "#313734", // Dash - Cards
      tooltip: "#484D4A", //Dash - Tooltip
    },
    v2: {
      white: "#FAFAFA",
      primary: "#ABF600",
      text: {
        primary: "#050605",
      },
    },
  },
  shadows: {
    light: "0px 5px 0px 0px #191A23",
    dark: "0px 5px 0px 0px #000",
  },
  components: {
    Alert,
    Button,
    Checkbox,
    Input,
    Menu,
    Progress,
    Tooltip,
  },
});

export default theme;
