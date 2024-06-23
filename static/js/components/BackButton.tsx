import { HStack, Icon, IconProps, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow-left.svg";

const BackButton: React.FC<IconProps> = ({ ...props }) => {
  const navigate = useNavigate();
  return (
    <HStack
      spacing="1"
      align="center"
      color="green.100"
      cursor="pointer"
      onClick={() => {
        navigate(-1);
      }}
    >
      <Icon as={ArrowLeftIcon} w="5" h="5" {...props} />
      <Text fontSize="sm">Back</Text>
    </HStack>
  );
};

export default BackButton;
