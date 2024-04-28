import { inputAnatomy as parts } from "@chakra-ui/anatomy";
import { transparentize } from "@chakra-ui/theme-tools";

const Input = {
  parts: parts.keys,
  baseStyle: {},
  variants: {
    primary: {
      field: {
        border: "1px solid",
        backgroundColor: transparentize("green.100", 0.07),
        borderColor: transparentize("green.accent.1", 0.95),
        py: "14px",
        px: "18px",
        _hover: {
          borderColor: "green.accent.1",
        },
        _placeholder: {
          color: "white.100",
        },
        _invalid: {
          borderColor: "red.500",
          backgroundColor: transparentize("green.100", 0.07),
        },
        _disabled: {
          borderColor: transparentize("green.100", 0.07),
        },
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};

export default Input;
