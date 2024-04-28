import { progressAnatomy as parts } from "@chakra-ui/anatomy";
import { generateStripe, transparentize } from "@chakra-ui/theme-tools";

const primaryStripe = generateStripe("1rem", "#2E583C");

const Progress = {
  parts: parts.keys,
  variants: {
    primary: {
      filledTrack: {
        bgColor: "green.100",
        ...primaryStripe,
      },
      track: {
        bgColor: transparentize("green.100", 0.07),
      },
    },
  },
};

export default Progress;
