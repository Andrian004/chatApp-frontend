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

const Reg = () => {
  const imgApi = import.meta.env.VITE_IMG_API_URL;
  const apiBase = import.meta.env.VITE_BASE_URL;
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [tempPic, setTempPic] = useState();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // post image to cloudinary
  const postData = (pics) => {
    setLoading(true);

    if (!username || !email || !password || !pics) {
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

    if (password !== confirmPass) {
      toast({
        title: "Password do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (
      pics.type === "image/jpg" ||
      pics.type === "image/jpeg" ||
      pics.type === "image/png"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "de39dewcq");

      axios
        .post(`${imgApi}/image/upload`, data)
        .then((res) => {
          // submit data
          submit(res.data.url);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  // submit data to API
  const submit = async (pic) => {
    try {
      const data = {
        username: username,
        email: email,
        password: password,
        pic: pic,
      };

      const res = await axios.post(`${apiBase}/user/reg`, data);

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
      toast({
        title: "Error!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Center w="100%">
        <Text mb="2" fontSize="xl" fontWeight="semibold">
          Sign Up
        </Text>
      </Center>
      <VStack spacing={4} align="stretch">
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" onChange={(e) => setUsername(e.target.value)} />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          <FormHelperText>We{"'"}ll never share your email.</FormHelperText>
        </FormControl>

        <FormControl id="photoProfile" isRequired>
          <FormLabel>Photo profile</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => setTempPic(e.target.files[0])}
          />
        </FormControl>

        <FormControl id="password" isRequired>
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
        </FormControl>

        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={showConfirm ? "text" : "password"}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <InputRightElement w="max" border>
              <Button
                borderLeftRadius="0"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="whatsapp"
          onClick={() => postData(tempPic)}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </>
  );
};

export default Reg;
