import { menuAnatomy as parts } from "@chakra-ui/anatomy";

const Menu = {
  parts: parts.keys,
  baseStyle: {},
  variants: {
    primary: {
      list: {
        bgColor: "dash.background",
        px: "4",
        py: "6",
        border: "none",
      },
      item: {
        bgColor: "dash.background",
        borderRadius: "8",
        transition: "background-color 0.3s ease",
        _hover: {
          bgColor: "green.200",
        },
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
};

export default Menu;
