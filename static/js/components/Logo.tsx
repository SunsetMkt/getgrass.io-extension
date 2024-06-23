import { AspectRatio, AspectRatioProps, Icon } from "@chakra-ui/react";
import { ReactComponent as DarkGrassLogo } from "../assets/logos/grass-logo.svg";
import { ReactComponent as SplashScreenLogo } from "../assets/logos/splash-screen-grass-logo.svg";

const Logo: React.FC<AspectRatioProps> = ({ ...props }) => {
  return (
    <AspectRatio ratio={2254 / 640} {...props}>
      <Icon as={DarkGrassLogo} />
    </AspectRatio>
  );
};

export const GrassLogo: React.FC<AspectRatioProps> = ({ ...props }) => {
  return (
    <AspectRatio ratio={157 / 192} {...props}>
      <Icon as={SplashScreenLogo} />
    </AspectRatio>
  );
};

export default Logo;
