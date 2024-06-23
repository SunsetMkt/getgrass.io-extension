import { alertAnatomy as parts } from "@chakra-ui/anatomy";

const Alert = {
  parts: parts.keys,
  baseStyle: {
    container: {
      border: "1px solid",
      boxShadow: "none",
      background: "green.accent.500",
      maxW: "320px",
    },
  },
  sizes: {},
  variants: {
    error: {
      container: {
        borderColor: "red.500",
      },
      icon: {
        color: "red.500",
      },
    },
    success: {
      container: {
        borderColor: "brand.green",
      },
      icon: {
        color: "brand.green",
      },
    },
    info: {
      container: {
        borderColor: "brand.green",
      },
      icon: {
        color: "brand.green",
      },
    },
  },
  defaultProps: {},
};

export default Alert;
