const Button = {
  baseStyle: {
    borderRadius: "full",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  sizes: {
    md: {
      fontSize: "xs",
    },
  },
  variants: {
    primary: {
      color: "green.200",
      bgColor: "green.100",
      _hover: {
        bgColor: "green.accent.1",
      },
      _active: {
        color: "white",
        bgColor: "green.200",
      },
      _disabled: {
        _hover: {
          bgColor: "green.100 !important",
        },
        bgColor: "green.100",
        opacity: "0.5",
      },
    },
    outlined: {
      bgColor: "transparent",
      border: "1px solid",
      color: "green.white.400",
      borderColor: "green.white.400",
      _hover: {
        color: "white",
        bgColor: "green.accent.1",
        borderColor: "brand.primary",
      },
      _active: {
        color: "white",
        bgColor: "green.accent.3",
        borderColor: "brand.primary",
      },
      _disabled: {
        _hover: {
          bgColor: "green.quiet.button !important",
        },
        color: "green.accent.1",
        borderColor: "green.quiet.button",
        opacity: "0.5",
      },
    },
    primaryGhost: {
      color: "green.white.400",
      bgColor: "transparent",
      _active: {
        color: "white",
        bgColor: "green.accent.3",
      },
      _hover: {
        color: "white",
        bgColor: "green.accent.1",
      },
      _disabled: {
        color: "green.accent.1",
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};

export default Button;
