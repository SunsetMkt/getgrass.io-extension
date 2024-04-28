import {
  Box,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";

import { GrassLogo } from "../Logo";

import { ReactComponent as EllipsisIcon } from "../../assets/icons/ellipsis-icon.svg";
import { ReactComponent as LogoutIcon } from "../../assets/icons/logout-icon.svg";
import { ReactComponent as RefreshIcon } from "../../assets/icons/refresh-icon.svg";

import { shortenString } from "../../utils/string";
import { useAuthContext } from "../../contexts/AuthContext";

const AuthHeader = () => {
  const { isAuthenticated, user, username, logoutUser, reconnect } =
    useAuthContext();

  return (
    <Flex
      as="header"
      justify="center"
      align="center"
      bgColor="v2.white"
      py="24px"
      px="18px"
      pos="relative"
    >
      <GrassLogo w="98px" />

      {isAuthenticated && user && (
        <HStack align="flex-start">
          <Text fontSize="sm" fontWeight="500" color="whiteAlpha.800">
            {username?.length > 20 ? shortenString(username, 10, 8) : username}
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

              <MenuItem onClick={logoutUser}>
                <HStack spacing="1.5">
                  <Icon as={LogoutIcon} w="4" h="4" />
                  <Text>Logout</Text>
                </HStack>
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      )}
    </Flex>
  );
};

export default AuthHeader;
