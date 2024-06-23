import {
  Box,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import Logo from "../Logo";

import { ReactComponent as EllipsisIcon } from "../../assets/icons/ellipsis-icon.svg";
import { ReactComponent as LogoutIcon } from "../../assets/icons/logout-icon.svg";
import { ReactComponent as RefreshIcon } from "../../assets/icons/refresh-icon.svg";
// import { ReactComponent as PauseIcon } from "../../assets/icons/pause-icon.svg";

import { shortenString } from "../../utils/string";
import { useAuthContext } from "../../contexts/AuthContext";
import { useLogoutUser } from "../../hooks/queries/auth/useLogoutUser";
// import { Actions } from "../../models/settings";

const Header = () => {
  const {
    isAuthenticated,
    username,
    refreshToken,
    userDataIsLoading,
    logoutUser: unAuthenticateUser,
    reconnect,
  } = useAuthContext();

  const { mutate: logoutUser } = useLogoutUser({
    onSuccess: () => {
      unAuthenticateUser();
    },
    onError: (err) => {
      console.error(`[LOGOUT] ${err}`);
    },
  });

  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      bgColor="dash.card"
      py="20px"
      px="18px"
      pos="relative"
    >
      <Logo w="108px" />

      {isAuthenticated && (
        <Skeleton isLoaded={!userDataIsLoading}>
          <HStack align="flex-start">
            <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800">
              {username?.length > 20
                ? shortenString(username, 10, 8)
                : username}
            </Text>

            <Menu flip>
              <MenuButton>
                <Icon as={EllipsisIcon} w="5" h="5" cursor="pointer" />
              </MenuButton>
              <MenuList as={Stack} fontSize="sm">
                {/* TODO: bring back the pause bandwidth function */}
                {/* <MenuItem
                onClick={() => {
                  updateSettings(Actions.PAUSE, 30);
                }}
                isDisabled={!Boolean(settings)}
              >
                <HStack spacing="1.5">
                  <Icon as={PauseIcon} w="4" h="4" />
                  <Text>Pause Bandwidth</Text>
                </HStack>
              </MenuItem> */}

                <MenuItem onClick={reconnect}>
                  <HStack spacing="1.5">
                    <Icon as={RefreshIcon} w="4" h="4" />
                    <Text>Reconnect</Text>
                  </HStack>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    logoutUser(refreshToken);
                  }}
                >
                  <HStack spacing="1.5">
                    <Icon as={LogoutIcon} w="4" h="4" />
                    <Text>Logout</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Skeleton>
      )}

      <Box
        pos="absolute"
        w="full"
        left="0"
        right="0"
        bottom="0"
        h="1px"
        bgColor="green.100"
      />
    </Flex>
  );
};

export default Header;
