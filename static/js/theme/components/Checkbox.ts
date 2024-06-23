import { checkboxAnatomy as parts } from "@chakra-ui/anatomy";
import { transparentize } from "@chakra-ui/theme-tools";

const Checkbox = {
  parts: parts.keys,
  baseStyle: {},
  variants: {
    primary: {
      control: {
        bgColor: transparentize("green.100", 0.07),
        border: "none",
        _checked: {
          bg: "green.accent.1",
          _hover: {
            bg: "green.accent.1",
          },
        },
      },
      icon: {
        bgColor: "green.accent.1",
        color: "white",
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};

export default Checkbox;
