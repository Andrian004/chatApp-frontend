import ScrollableFeed from "react-scrollable-feed";
import { formatTime, isLastMessage, isSameSender } from "../config/ChatLogic";
import { ChatState } from "../context/ChatProvider";
import { jwtDecode } from "jwt-decode";
import { Tooltip, Avatar, Text, Box } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const token = user.token;
  const decoded = jwtDecode(token);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          return (
            <div
              className={
                m.sender._id === decoded._id ? "flex-end" : "flex-start"
              }
              key={m._id}
            >
              {(isSameSender(messages, m, i, decoded._id) ||
                isLastMessage(messages, i, decoded._id)) && (
                <Tooltip label={m.sender.name} placement="bottom" hasArrow>
                  <Avatar
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}

              {!isSameSender(messages, m, i, decoded._id) &&
              !isLastMessage(messages, i, decoded._id) &&
              m.sender._id !== decoded._id ? (
                <Box
                  bg={m.sender._id === decoded._id ? "gray.200" : "green.300"}
                  borderRadius="20px 20px 20px 2px"
                  padding="5px 15px"
                  maxW="75%"
                  ml={9}
                >
                  {m.chat.isGroupChat && (
                    <Text fontSize="0.8rem" fontWeight="semibold">
                      {m.sender.name}
                    </Text>
                  )}
                  {m.content}
                  <Text fontSize="0.7rem" textAlign="end">
                    {formatTime(new Date(m.createdAt).getHours())}.
                    {formatTime(new Date(m.createdAt).getMinutes())}
                  </Text>
                </Box>
              ) : (
                <Box
                  bg={m.sender._id === decoded._id ? "gray.200" : "green.300"}
                  borderRadius="20px"
                  padding="5px 15px"
                  maxW="75%"
                  m={0}
                >
                  {m.chat.isGroupChat && (
                    <Text fontSize="0.8rem" fontWeight="semibold">
                      {m.sender.name}
                    </Text>
                  )}
                  {m.content}
                  <Text fontSize="0.7rem" textAlign="end">
                    {formatTime(new Date(m.createdAt).getHours())}.
                    {formatTime(new Date(m.createdAt).getMinutes())}
                  </Text>
                </Box>
              )}
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
