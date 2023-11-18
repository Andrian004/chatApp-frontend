import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/ChatProvider";
import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaoneus/ProfileModal";
import UpdatedGroupChatModal from "./miscellaoneus/UpdatedGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
  Flex,
  Button,
  useToast,
} from "@chakra-ui/react";

const ENDPOINT = import.meta.env.VITE_BASE_URL;
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [msgReceived, setMsgReceived] = useState();
  const [isNotif, setIsNotif] = useState(false);
  const { user, selectedChat, setSelectedChat, notif, setNotif } = ChatState();
  const toast = useToast();

  const token = user.token;
  const decoded = jwtDecode(token);

  const userData = getSenderFull(user, selectedChat);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", decoded);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${baseUrl}/message`,
        { content: newMessage, chatId: selectedChat._id },
        config
      );
      setNewMessage("");

      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Failed to send message!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Failed to load messages!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const typingHandler = (text) => {
    setNewMessage(text);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendNotif = () => {
    if (!msgReceived) return;

    if (!notif.find((chat) => chat.chatId._id === msgReceived.chat._id)) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      axios
        .post(
          `${baseUrl}/notif`,
          {
            userId: decoded._id,
            chatId: msgReceived.chat._id,
            sender: msgReceived.sender._id,
          },
          config
        )
        .then((res) => {
          setIsNotif(false);
          setNotif(res.data.chats);
          setFetchAgain(!fetchAgain);
        })
        .catch((error) => {
          setIsNotif(false);
          console.log(error.response.data.message);
        });
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    sendNotif();
  }, [isNotif]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        setMsgReceived(newMessageReceived);
        setIsNotif(true);
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                <Box h="50px">
                  <Text fontSize="2xl">
                    {getSender(user, selectedChat.users)}
                  </Text>
                  {isTyping ? <Text fontSize="11px">Typing...</Text> : ""}
                </Box>

                <ProfileModal user={userData} pic={userData.pic} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdatedGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Box>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="center"
            p={3}
            bg="gray.100"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner alignSelf="center" size="xl" m="auto" />
            ) : (
              <div className="message-box">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl alignSelf="buttom" m={0}>
              <form onSubmit={sendMessage}>
                <Flex gap={1}>
                  <Input
                    type="text"
                    placeholder="Write message"
                    value={newMessage}
                    onChange={(e) => typingHandler(e.target.value)}
                    bg="white"
                  />
                  <Button type="submit" bg="green.300">
                    <i className="bi bi-send"></i>
                  </Button>
                </Flex>
              </form>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          w="100%"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="2xl">Start chat with your friends now!</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
