import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  Image,
  Link,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import _ from "lodash";

import { WifiAnimation } from "../components/Wifi";
import { ReactComponent as DashboardIcon } from "../assets/icons/dashboard-icon.svg";
import { ReactComponent as LinkPlusIcon } from "../assets/icons/link-plus-icon.svg";
import { LINKS } from "../constants/links";
import { useAuthContext } from "../contexts/AuthContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { PERMISSIONS_KEY, STATUS_KEY } from "../constants/keys";
import { Status } from "../models/settings";
import tokenImage from "../assets/icons/token.png";
import { formatNumber } from "../utils/format";
import { usePauseConnection } from "../hooks/queries/auth/usePauseConnection";
import { QueryKeys } from "../constants/queryKeys";
import { useEpochEarningsData } from "../hooks/queries/seller/useEpochEarningsData";
import { EpochEarning } from "../models/seller";
import { useActiveDevicesData } from "../hooks/queries/seller/useActiveDevicesData";
import { IGNORE_POINTS_DIFFERENCE } from "../constants/api";
import { calculatePoints } from "../utils/seller";
import { useActiveIpsData } from "../hooks/queries/seller/useActiveIpsData";

dayjs.extend(utc);
dayjs.extend(isBetween);

const Dashboard = () => {
  const toast = useToast();
  const {
    isAuthenticated,
    user,
    device,
    previousScore,
    userSettings,
    updateUserSettings,
  } = useAuthContext();
  const [connectionQuality, setConnectionQuality] = useState(0);
  const [isReferralCopied, setIsReferralCopied] = useState(false);
  const [status, setStatus] = useLocalStorage(STATUS_KEY, Status.DISCONNECTED);
  const [hasPermissions] = useLocalStorage<boolean | undefined>(
    PERMISSIONS_KEY,
    undefined
  );
  const [currentEpochEarning, setCurrentEpochEarning] =
    useState<EpochEarning | null>(null);
  const [todayTotalPoints, setTodayTotalPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const { mutateAsync: pauseConnection, isPending: pauseConnectionIsPending } =
    usePauseConnection({
      onSuccess: () => {
        updateUserSettings({
          pauseConnectionExpiry: dayjs.utc().format(),
          isConnectionPaused: false,
        });

        toast({
          title: "Success!",
          description: "Sharing will be resumed in a few seconds",
          status: "success",
          variant: "success",
          position: "top-left",
          isClosable: true,
        });
      },
      onError: () => {
        toast({
          title: "Error!",
          description: "Please try again after a few seconds",
          status: "error",
          variant: "error",
          position: "top-left",
          isClosable: true,
        });
      },
    });

  const {
    data: epochEarningsData,
    isSuccess: epochEarningsDataIsSuccess,
    isLoading: epochEarningsDataIsLoading,
  } = useEpochEarningsData(
    { limit: 1 },
    {
      enabled: isAuthenticated && !!user,
      queryKey: [QueryKeys.EPOCH_EARNINGS, user?.userId],
    }
  );

  useEffect(() => {
    if (epochEarningsData && epochEarningsDataIsSuccess) {
      const epochEarning = epochEarningsData.data.result.data.data[0];

      if (epochEarning) {
        const startDate = dayjs.utc(epochEarning.startDate);
        const endDate = dayjs.utc(epochEarning.endDate);
        const today = dayjs.utc();

        if (today.isBetween(startDate, endDate, "day", "[]")) {
          setCurrentEpochEarning(epochEarning);
        }
      }
    }
  }, [epochEarningsData, epochEarningsDataIsSuccess]);

  const { data: activeDevicesData, isSuccess: activeDevicesDataIsSuccess } =
    useActiveDevicesData({
      enabled: isAuthenticated && !!user,
      queryKey: [QueryKeys.ACTIVE_DEVICES, user?.userId],
    });

  const { data: activeIpsData, isSuccess: activeIpsDataIsSuccess } =
    useActiveIpsData({
      enabled: isAuthenticated && !!user,
      queryKey: [QueryKeys.ACTIVE_IPS],
    });

  useEffect(() => {
    if (
      activeDevicesData &&
      activeDevicesDataIsSuccess &&
      activeIpsData &&
      activeIpsDataIsSuccess
    ) {
      const now = dayjs.utc();
      const activeDevices = activeDevicesData.data.result.data;
      const activeIps = activeIpsData.data.result.data;
      let todayTotalPoints = 0;

      if (activeDevices.length > 0) {
        activeDevices.forEach((activeDevice) => {
          let diffFromLastConnected = 0;

          if (!!activeDevice.lastConnectedAt) {
            const lastConnected = dayjs.utc(activeDevice.lastConnectedAt);
            diffFromLastConnected = Math.abs(
              now.diff(lastConnected, "seconds")
            );
          }

          if (diffFromLastConnected >= IGNORE_POINTS_DIFFERENCE) {
            diffFromLastConnected = IGNORE_POINTS_DIFFERENCE;
          }

          const points = calculatePoints(
            diffFromLastConnected,
            activeDevice.ipScore
          );

          todayTotalPoints += points;

          return {
            ...activeDevice,
            todayTotalPoints: points,
            todayTotalUptime: diffFromLastConnected,
          };
        });
      }

      if (activeIps.length > 0) {
        activeIps
          .filter((activeIp) => {
            return activeIp.date === now.format("YYYY-MM-DD");
          })
          .forEach((activeIp) => {
            const diffFromLastConnected = activeIp.totalUptime;
            const points = calculatePoints(
              diffFromLastConnected,
              activeIp.ipScore
            );

            todayTotalPoints += points;

            const activeDeviceIndex = _.findIndex(
              activeDevices,
              (activeDevice) => {
                return activeDevice.ipAddress === activeIp.ipAddress;
              }
            );

            if (activeDeviceIndex >= 0) {
              if (
                Number.isNaN(activeDevices[activeDeviceIndex].todayTotalPoints)
              ) {
                activeDevices[activeDeviceIndex].todayTotalPoints = points;
              } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                activeDevices[activeDeviceIndex].todayTotalPoints += points;
              }

              if (
                Number.isNaN(activeDevices[activeDeviceIndex].todayTotalUptime)
              ) {
                activeDevices[activeDeviceIndex].todayTotalUptime =
                  diffFromLastConnected;
              } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                activeDevices[activeDeviceIndex].todayTotalUptime +=
                  diffFromLastConnected;
              }
            } else {
              activeDevices.push({
                ...activeIp,
                todayTotalPoints: points,
                todayTotalUptime: diffFromLastConnected,
                lastConnectedAt: "",
              });
            }
          });
      }

      setTodayTotalPoints(todayTotalPoints);
    }
  }, [
    activeDevicesData,
    activeDevicesDataIsSuccess,
    activeIpsData,
    activeIpsDataIsSuccess,
  ]);

  useEffect(() => {
    let totalPoints = todayTotalPoints;

    if (currentEpochEarning) {
      totalPoints += currentEpochEarning.totalPoints;
    }

    setTotalPoints(totalPoints);
  }, [todayTotalPoints, currentEpochEarning]);

  const isConnected = useMemo(() => {
    return (
      status === Status.CONNECTED &&
      !userSettings?.isConnectionPaused &&
      !!hasPermissions
    );
  }, [status, userSettings]);

  const isConnecting = useMemo(() => {
    return status === Status.CONNECTING;
  }, [status]);

  const connectionColor = useMemo(() => {
    if (isConnected) {
      if (connectionQuality >= 0 && connectionQuality <= 33) {
        return "brand.red";
      } else if (connectionQuality > 33 && connectionQuality <= 67) {
        return "brand.orange";
      } else {
        return "brand.green";
      }
    } else {
      return "brand.gray";
    }
  }, [connectionQuality, isConnected]);

  const connectionMessage = useMemo(() => {
    if (isConnected) {
      if (connectionQuality >= 0 && connectionQuality <= 33) {
        return "Poor network quality - try connecting to a different network or turning off your VPN if you have one enabled.";
      } else if (connectionQuality > 33 && connectionQuality <= 67) {
        return "Network quality is okay - you are earning at a reduced rate.";
      } else {
        return "You’re doing great! Keep connected to this network to earn.";
      }
    } else {
      if (!hasPermissions) {
        return "You have blocked permissions to access sites. Please unblock it to continue earning";
      }

      if (status === Status.DEAD) {
        return "Connection lost, trying to reconnect your device to our servers";
      } else if (status === Status.CONNECTING) {
        return "Connecting to our servers. Please wait...";
      }

      return "Connect to the internet to restart earning.";
    }
  }, [isConnected, connectionQuality, hasPermissions, status]);

  useEffect(() => {
    if (status && status === Status.DEAD && isAuthenticated) {
      toast({
        title: "Device connection loss",
        description:
          "Trying to reconnect your device to our servers. If it does not connect in a few seconds, please try refreshing the app or check your network connection.",
        status: "error",
        variant: "error",
        position: "top-left",
        isClosable: true,
      });
    }
  }, [status, isAuthenticated]);

  useEffect(() => {
    const handleNetworkEvent = (evt: Event) => {
      if (
        typeof chrome.runtime !== "undefined" &&
        process.env.NODE_ENV === "production"
      ) {
        if (evt.type === "online") {
          setStatus(Status.CONNECTED);
        } else if (evt.type === "offline") {
          setStatus(Status.DISCONNECTED);
        }
      } else {
        console.log(evt.type);
      }
    };

    window.addEventListener("online", handleNetworkEvent);
    window.addEventListener("offline", handleNetworkEvent);

    return () => {
      window.removeEventListener("online", () => {
        console.log("[ONLINE-CLEANUP]");
      });
      window.removeEventListener("offline", () => {
        console.log("[OFFLINE-CLEANUP]");
      });
    };
  }, []);

  useEffect(() => {
    let timeoutFunction: NodeJS.Timeout;

    if (isReferralCopied) {
      timeoutFunction = setTimeout(() => {
        setIsReferralCopied(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutFunction);
    };
  }, [isReferralCopied]);

  useEffect(() => {
    if (device && device.ipScore) {
      setConnectionQuality(device.ipScore);
    } else {
      setConnectionQuality(0);
    }
  }, [device]);

  return isConnecting ? (
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

        <Text fontSize="sm" color="green.white" fontWeight="600">
          Connecting ...
        </Text>
      </Stack>
    </Center>
  ) : (
    <Box>
      <Stack align="center" mt="8" spacing="6">
        <Badge
          textTransform="none"
          bgColor="whiteAlpha.100"
          borderRadius="full"
          color="white"
          w="fit-content"
          px="4"
          py="1"
        >
          <Flex align="center" gap="1.5">
            <Box
              w="2"
              h="2"
              borderRadius="full"
              bgColor={isConnected ? "brand.green" : "brand.gray"}
            />
            <Text fontSize="sm">
              {isConnected ? "Connected" : "Disconnected"}
            </Text>
          </Flex>
        </Badge>

        <Skeleton pos="relative" isLoaded={!!device}>
          <WifiAnimation
            w="20"
            h="20"
            isWorking={isConnected}
            color={connectionColor}
            pos="relative"
            zIndex="2"
          />
        </Skeleton>

        <Stack spacing="1" align="center" textAlign="center" maxW="80%">
          {isConnected && (
            <>
              <Skeleton isLoaded={!!device}>
                <Text fontSize="sm" color={connectionColor} fontWeight="600">
                  Network quality: {connectionQuality}%
                </Text>
              </Skeleton>

              <Skeleton isLoaded={!!device}>
                {!!previousScore &&
                  previousScore > 0 &&
                  device?.ipScore !== previousScore && (
                    <Text fontSize="xs" fontWeight="500">
                      (previously {previousScore}%)
                    </Text>
                  )}
              </Skeleton>
            </>
          )}

          <Skeleton isLoaded={!!device}>
            <Text fontSize="sm" fontWeight="600">
              {connectionMessage}
            </Text>
          </Skeleton>
        </Stack>
      </Stack>

      {!isConnected && userSettings && userSettings?.isConnectionPaused && (
        <Tooltip
          label={`Bandwidth is paused until ${dayjs(
            userSettings.pauseConnectionExpiry
          ).format("MMM DD, YYYY hh:mma ")}`}
          placement="top"
          isDisabled={!userSettings.isConnectionPaused}
        >
          <Button
            w="full"
            mt="8"
            mb="-12"
            onClick={() => {
              // Cannot set to 0 because it's false as a boolean check
              pauseConnection({
                pauseConnectionExpiry: dayjs.utc().add(3, "second").format(),
              });
            }}
            isLoading={!Boolean(userSettings) || pauseConnectionIsPending}
            isDisabled={!userSettings.isConnectionPaused}
          >
            Connect
          </Button>
        </Tooltip>
      )}

      <Stack spacing="5" mt="16" align="center" textAlign="center">
        <Box w="full" h="0.7px" bgColor="whiteAlpha.200" />

        <HStack
          fontSize="sm"
          color="green.white.100"
          fontWeight="500"
          align="center"
          spacing="2"
        >
          <Skeleton isLoaded={!epochEarningsDataIsLoading}>
            <Text>{currentEpochEarning?.epochName} earnings: </Text>
          </Skeleton>

          <Tooltip
            label={totalPoints.toLocaleString()}
            placement="top"
            isDisabled={!totalPoints}
          >
            <HStack spacing="1" align="center" cursor="pointer">
              <Image src={tokenImage} alt="token" w="5" h="5" />
              <Skeleton isLoaded={!epochEarningsDataIsLoading}>
                <Text>{totalPoints ? formatNumber(totalPoints) : 0}</Text>
              </Skeleton>
            </HStack>
          </Tooltip>
        </HStack>

        <Grid templateColumns="repeat(2,1fr)" gridGap="2" w="full">
          <Link href={`${LINKS.GRASS_DASHBOARD_APP}/dashboard`} isExternal>
            <Button
              variant="outlined"
              leftIcon={<Icon as={DashboardIcon} w="3" h="3" />}
              fontWeight="600"
              w="full"
            >
              Open dashboard
            </Button>
          </Link>

          <CopyToClipboard
            text={`${LINKS.GRASS_DASHBOARD_APP}/register?referralCode=${user?.referralCode}`}
            onCopy={() => {
              setIsReferralCopied(true);
            }}
          >
            <Button
              variant="outlined"
              leftIcon={<Icon as={LinkPlusIcon} w="4" h="4" />}
              fontWeight="600"
              w="full"
            >
              {isReferralCopied ? "Copied" : "Refer a friend"}
            </Button>
          </CopyToClipboard>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Dashboard;
