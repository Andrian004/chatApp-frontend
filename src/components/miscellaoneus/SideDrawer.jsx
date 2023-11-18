import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../User/UserListItem";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  DrawerFooter,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
// import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { user, setSelectedChat, chats, setChats, notif, setNotif } =
    ChatState();
  const token = user.token;
  const decoded = jwtDecode(token);

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search) {
      toast({
        title: "Please enter something!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to load search results!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${baseUrl}/chat`,
        { userId: userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
    }
  };

  const notifHandler = async (chat) => {
    try {
      const redirect = chats.filter((u) => u._id == chat._id);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.patch(
        `${baseUrl}/notif`,
        {
          userId: decoded._id,
          chatId: chat._id,
        },
        config
      );

      setNotif(data.chats);
      setSelectedChat(redirect[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotif = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/notif/${decoded._id}`,
        config
      );

      setNotif(data.chats);
    } catch (error) {
      console.log("error bro");
    }
  };

  useEffect(() => {
    getNotif();
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        bg="white"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Search friends to chat."
          hasArrow
          placement="bottom-end"
        >
          <Button colorScheme="whatsapp" onClick={onOpen}>
            <i className="bi bi-search"></i>
            <Text display={{ base: "none", md: "flex" }} ms={2}>
              Search Friends
            </Text>
          </Button>
        </Tooltip>

        <Text w="max" fontSize="2xl" fontWeight="semibold" color="green">
          Pybro
        </Text>

        <Flex gap="2">
          <Menu>
            <MenuButton>
              <div className="notif-badge">
                <BellIcon fontSize={"2xl"} />
                {notif.length > 0 && (
                  <div className="notif-icon">
                    {notif.length >= 10 ? "9" : notif.length}
                  </div>
                )}
              </div>
            </MenuButton>
            <MenuList p={2}>
              {!notif.length && "No New Messages"}
              {notif.map((e) => {
                return (
                  <MenuItem key={e._id} onClick={() => notifHandler(e.chatId)}>
                    {e.chatId.isGroupChat
                      ? `New message in ${e.chatId.chatName}`
                      : `New message from ${e.sender.name}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} px={2}>
              <Avatar
                name={decoded.username}
                size="sm"
                cursor="pointer"
                src={user.pic}
                bg="teal.500"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={decoded} pic={user.pic}>
                <MenuItem>MyProfil</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Search your friends
          </DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSearch}>
              <Flex gap={2} mb={3}>
                <Input
                  placeholder="Type here..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  type="submit"
                  colorScheme="whatsapp"
                  isLoading={loading}
                >
                  <SearchIcon />
                </Button>
              </Flex>
            </form>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    userData={user}
                    handleClick={() => accessChat(user._id)}
                  />
                );
              })
            )}
          </DrawerBody>
          {loadingChat && (
            <DrawerFooter>
              <Spinner color="green.500" />
              <Text ms={2}>Creating Chats</Text>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
