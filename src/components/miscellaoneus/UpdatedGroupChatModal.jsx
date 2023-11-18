import { useState } from "react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "../User/UserBadge";
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  useDisclosure,
  IconButton,
  FormControl,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import UserListItem from "../User/UserListItem";

const UpdatedGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  // const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const token = user.token;
  const decoded = jwtDecode(token);

  const handleRemove = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== decoded._id &&
      user1._id !== decoded._id
    ) {
      toast({
        title: "Only Admin can remove member!",
        status: "error",
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

      const { data } = await axios.put(
        `${baseUrl}/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === decoded.id ? selectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.massage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
      setLoading(false);
    }
  };

  const handleRename = async (user1) => {
    if (!groupChatName) return;

    if (
      selectedChat.groupAdmin._id !== decoded._id &&
      user1._id !== decoded._id
    ) {
      toast({
        title: "Only Admin can edit group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseUrl}/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error to create a group!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/user?search=${query}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  const handleAddUsr = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== decoded._id) {
      toast({
        title: "Only admin can add someone!",
        status: "error",
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

      const { data } = await axios.put(
        `${baseUrl}/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.massage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-start",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        color="black"
        icon={<InfoIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              <Box
                px={2}
                py={1}
                borderRadius="lg"
                mx={1}
                mb={2}
                fontSize="12px"
                bg="green.300"
                cursor="pointer"
              >
                {selectedChat.groupAdmin.name} <CheckCircleIcon ml={2} />
              </Box>
              {selectedChat.users
                .filter((u) => u._id !== selectedChat.groupAdmin._id)
                .map((user) => {
                  return (
                    <UserBadge
                      key={user._id}
                      userData={user}
                      handleClick={() => handleRemove(user)}
                    />
                  );
                })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                bg="gray.200"
                ml={1}
                isLoading={renameLoading}
                onClick={() => handleRename(user)}
              >
                Update
              </Button>
            </FormControl>

            <FormControl display="flex">
              <Input
                placeholder="Add user to group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    userData={user}
                    handleClick={() => handleAddUsr(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRemove(decoded);
                window.location.reload();
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatedGroupChatModal;
