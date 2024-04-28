import { Icon, IconProps, useToken } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { ReactComponent as WifiOff } from "../assets/icons/wifi-off.svg";
import { ReactComponent as WifiLow } from "../assets/icons/wifi-low.svg";
import { ReactComponent as WifiMed } from "../assets/icons/wifi-med.svg";
import { ReactComponent as WifiHigh } from "../assets/icons/wifi-high.svg";

export const WifiOffIcon: React.FC<IconProps> = (props) => {
  const [color] = useToken("colors", [props.color as string]);

  return (
    <Icon
      as={WifiOff}
      color="brand.orange"
      boxShadow="0px 1px 1px whiteAlpha.500"
      filter={`drop-shadow(0px 3px 4px ${color})`}
      {...props}
    />
  );
};

export const WifiLowIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      as={WifiLow}
      color="brand.green"
      boxShadow="0px 1px 1px whiteAlpha.500"
      {...props}
    />
  );
};

export const WifiMedIcon: React.FC<IconProps> = (props) => {
  const [brandGreen] = useToken("colors", ["brand.green"]);

  return (
    <Icon
      as={WifiMed}
      color="brand.orange"
      boxShadow="0px 1px 1px whiteAlpha.500"
      // filter={`drop-shadow(0px 3px 4px ${brandGreen})`}
      {...props}
    />
  );
};

export const WifiHighIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon
      as={WifiHigh}
      color="brand.green"
      boxShadow="0px 1px 1px whiteAlpha.500"
      {...props}
    />
  );
};

interface WifiAnimationProps extends IconProps {
  isWorking: boolean;
}

const wifiAnimationIcons = [
  WifiLowIcon,
  WifiMedIcon,
  WifiHighIcon,
  WifiMedIcon,
];

export const WifiAnimation: React.FC<WifiAnimationProps> = ({
  isWorking,
  ...props
}) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [color] = useToken("colors", [props.color as string]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIconIndex === wifiAnimationIcons.length - 1) {
        setCurrentIconIndex(0);
      } else {
        setCurrentIconIndex(currentIconIndex + 1);
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentIconIndex]);

  if (!isWorking) {
    return <WifiOffIcon {...props} />;
  }

  return (
    <Icon
      as={wifiAnimationIcons[currentIconIndex]}
      color="brand.green"
      filter={`drop-shadow(0px 0px 10px ${color})`}
      {...props}
    />
  );
};
