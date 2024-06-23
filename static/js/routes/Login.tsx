import { Button, Stack, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { LINKS } from "../constants/links";

function LoginForm() {
  return (
    <Stack spacing="3" mt="20" mb={40} overflow="hidden" pb={2} px={4}>
      <ChakraLink href={`${LINKS.GRASS_DASHBOARD_APP}`} isExternal>
        <Button
          w="full"
          bgColor="v2.primary"
          borderColor="black"
          border="1px solid"
          color="v2.text.primary"
          fontFamily="v2.body"
          fontWeight="700"
          lineHeight="120%"
          fontSize="md"
          _hover={{
            boxShadow: "light",
            bgColor: "v2.primary",
            color: "black",
          }}
          _active={{
            boxShadow: "light",
            bgColor: "v2.primary",
            color: "black",
          }}
        >
          Login
        </Button>
      </ChakraLink>

      <Link to={ROUTES.FORGOT_PASSWORD}>
        <Button
          variant="primaryGhost"
          w="full"
          border="1px solid"
          borderColor="transparent"
          color="v2.text.primary"
          fontFamily="v2.body"
          fontWeight="700"
          lineHeight="120%"
          fontSize="md"
          _hover={{
            boxShadow: "light",
            bgColor: "v2.primary",
            color: "black",
            borderColor: "black",
          }}
          _active={{
            borderColor: "black",
            boxShadow: "light",
            bgColor: "v2.primary",
            color: "black",
          }}
        >
          Forgot Password
        </Button>
      </Link>
      <ChakraLink href={LINKS.GRASS_DASHBOARD_APP_REGISTRATION} isExternal>
        <Button
          variant="outlined"
          w="full"
          bgColor="black"
          color="white"
          borderColor="black"
          border="1px solid"
          fontFamily="v2.body"
          fontWeight="700"
          lineHeight="120%"
          fontSize="md"
          _hover={{
            boxShadow: "light",
            bgColor: "v2.primary",
            color: "v2.text.primary",
          }}
          _active={{
            boxShadow: "light",
            bgColor: "v2.primary",
            color: "v2.text.primary",
          }}
        >
          Register with email
        </Button>
      </ChakraLink>
    </Stack>
  );
}

export default LoginForm;
