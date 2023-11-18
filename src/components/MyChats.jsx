import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaoneus/GroupChatModal";
import { getSender, getSenderPic } from "../config/ChatLogic";
import {
  useToast,
  Box,
  Button,
  Stack,
  Text,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";

const MyChats = ({ fetchAgain }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats, setNotif } =
    ChatState();
  const toast = useToast();

  const token = user.token;
  const decoded = jwtDecode(token);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${baseUrl}/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load chats!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
    }
  };

  const selectChat = async (chat) => {
    try {
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
      setSelectedChat(chat);
      setNotif(data.chats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={{ base: 1, md: 3 }}
        bg="white"
        w={{ base: "100%", md: "37%", lg: "35%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "20px", md: "23px", lg: "30px" }}
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "15px", md: "12px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="gray.100"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack>
              {chats.map((chat) => {
                return (
                  <Box
                    key={chat._id}
                    onClick={() => selectChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "green.400" : "gray.300"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    {chat.isGroupChat ? (
                      <Avatar size="sm" name={chat.chatName} />
                    ) : (
                      <Avatar
                        size="sm"
                        name={getSender(loggedUser, chat.users)}
                        src={getSenderPic(loggedUser, chat.users)}
                      >
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                      </Avatar>
                    )}
                    <Box>
                      <Text>
                        {chat.isGroupChat
                          ? chat.chatName
                          : getSender(loggedUser, chat.users)}
                      </Text>

                      {chat.latestMessage && (
                        <Text fontSize="0.8rem" noOfLines={1}>
                          <span style={{ fontWeight: "bold" }}>
                            {chat.latestMessage.sender.name === decoded.username
                              ? "You"
                              : chat.latestMessage.sender.name}
                            :{" "}
                          </span>
                          {chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
