import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as AtIcon } from "../assets/icons/at-icon.svg";
import { ReactComponent as MailCircleIcon } from "../assets/icons/mail-circle-icon.svg";
import { ROUTES } from "../constants/routes";
import BackButton from "../components/BackButton";
import { useForgotPassword } from "../hooks/queries/auth/useForgotPassword";

const ForgotPassword = () => {
  const toast = useToast();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { mutate: forgotPassword } = useForgotPassword({
    onSuccess: () => {
      setIsSubmitSuccessful(true);
    },
    onError: (err) => {
      console.error(`[FORGOT PASSWORD] ${err}`);

      toast({
        title: "Error",
        description: err.response?.data.error.message,
        status: "error",
        variant: "error",
        position: "top-left",
        isClosable: true,
      });

      setIsSubmitSuccessful(false);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    forgotPassword({ email: data.email });
  });

  return isSubmitSuccessful ? (
    <Stack spacing="8" align="center">
      <Heading fontSize="2xl">Check your email</Heading>
      <Icon as={MailCircleIcon} w="150px" h="150px" color="green.accent.1" />
      <Link to={ROUTES.LOGIN} style={{ width: "100%" }}>
        <Button w="full">Go back to login</Button>
      </Link>
    </Stack>
  ) : (
    <Stack as="form" spacing="8" textAlign="center">
      <BackButton />
      <Heading fontSize="2xl">Enter your email</Heading>

      <FormControl isInvalid={!!errors?.email}>
        <InputGroup>
          <InputLeftElement h="full">
            <Icon as={AtIcon} w="6" h="6" color="green.100" />
          </InputLeftElement>
          <Input
            placeholder="Email"
            h="fit-content"
            type="email"
            {...register("email", {
              required: "This is required",
            })}
          />
        </InputGroup>

        {errors.email && (
          <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>
        )}
      </FormControl>

      <Button onClick={onSubmit} isLoading={isSubmitting}>
        Send to Email
      </Button>
    </Stack>
  );
};

export default ForgotPassword;
