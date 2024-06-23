import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: 800;
        font-display: swap;
        src: url('../assets/fonts/roobert/Roobert-Heavy.otf') format('otf');
      }
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('../assets/fonts/roobert/Roobert-Bold.otf') format('otf');
      }
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('../assets/fonts/roobert/Roobert-Medium.otf') format('otf');
      }
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('../assets/fonts/roobert/Roobert-Bold.otf') format('otf');
      }
      @font-face {
        font-family: 'Roobert';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('../assets/fonts/roobert/Roobert-Light.otf') format('otf');
      }
    `}
  />
);

export default Fonts;
