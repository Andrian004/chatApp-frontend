import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import Login from "../components/Auth/Login";
import Reg from "../components/Auth/Reg";

const HomePage = () => {
  const navigate = useNavigate();

  // if user logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent py={10}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="white"
        w="100%"
        p={5}
        borderRadius="5px"
      >
        <Text w="max" fontSize="2xl" fontWeight="semibold">
          Welcome to Pybro
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="white"
        w="100%"
        p={5}
        mt={2}
        borderRadius="5px"
      >
        <Tabs variant="soft-rounded" colorScheme="green" w="100%">
          <TabList mb="5px">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Reg />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
