import Header from "./Header";
import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box as="main" bgColor="dash.background" py="6" px="4" h="full">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
