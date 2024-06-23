import { Center, Spinner, Stack } from "@chakra-ui/react";
import { useAuthContext } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (typeof isAuthenticated !== "undefined") {
      if (isAuthenticated) {
        navigate(ROUTES.DASHBOARD);
      } else {
        navigate(ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated]);

  return (
    <Center mt="32">
      <Stack align="center" textAlign="center" spacing="6">
        <Spinner
          thickness="8px"
          speed="0.65s"
          emptyColor="whiteAlpha.600"
          color="green.white.400"
          w="80px"
          h="80px"
        />
      </Stack>
    </Center>
  );
};

export default Home;
