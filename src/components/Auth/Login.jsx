import { useState } from "react";
import axios from "axios";

import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormHelperText,
  Text,
  Button,
  Center,
  useToast,
} from "@chakra-ui/react";

const Login = () => {
  const apiBase = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const login = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(`${apiBase}/user/login`, data);

      toast({
        title: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      const info = {
        token: res.data.token,
        pic: res.data.pic,
      };

      localStorage.setItem("userInfo", JSON.stringify(info));
      setLoading(false);
      window.location.replace("/chats");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <Center w="100%">
        <Text mb="2" fontSize="xl" fontWeight="semibold">
          Login
        </Text>
      </Center>
      <VStack spacing={4} align="stretch">
        <FormControl id="loginEmail" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          <FormHelperText>We{"'"}ll never share your email.</FormHelperText>
        </FormControl>

        <FormControl id="loginPassword" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement w="max" border>
              <Button borderLeftRadius="0" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormHelperText>
            Forgot the password?{" "}
            <a href="/" style={{ color: "blue" }}>
              Click here.
            </a>
          </FormHelperText>
        </FormControl>

        <Button colorScheme="whatsapp" onClick={login} isLoading={loading}>
          Login
        </Button>

        <Button
          colorScheme="red"
          onClick={() => {
            alert("Minimal buat akun dulu lah!");
          }}
          isLoading={loading}
        >
          Try Guest
        </Button>
      </VStack>
    </>
  );
};

export default Login;
