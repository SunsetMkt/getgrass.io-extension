import AuthHeader from "./AuthHeader";
import { Box } from "@chakra-ui/react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box>
      <AuthHeader />
      <Box as="main" bgColor="v2.white" py="6" px="4" h="full">
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
