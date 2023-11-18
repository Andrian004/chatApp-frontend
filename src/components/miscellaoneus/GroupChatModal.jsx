import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import UserBadge from "../User/UserBadge";
import {
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Flex,
  useToast,
} from "@chakra-ui/react";

const GroupChatModal = ({ children }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState();
  const [selectUsers, setSelectUsers] = useState([]);
  // const [searchUsers, setSearchUsers] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    // setSearchUsers(query);

    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${baseUrl}/user?search=${query}`,
        config
      );

      setSearchResults(data);
      console.log(data);
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

  const handleGroup = (userToAdd) => {
    if (selectUsers.includes(userToAdd)) {
      toast({
        title: "User already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectUsers([...selectUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectUsers(selectUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupName || !selectUsers) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${baseUrl}/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      setLoading(false);
      onClose();
      toast({
        title: "Success creating a group!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error to create a group!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="start">
            <FormControl id="groupName" isRequired>
              <FormLabel>Group Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>
            <FormControl id="searchUsers" mb={1} isRequired>
              <FormLabel>Search Member</FormLabel>
              <Input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Add member"
              />
            </FormControl>

            <Flex>
              {selectUsers.map((u) => {
                return (
                  <UserBadge
                    key={u._id}
                    userData={u}
                    handleClick={() => handleDelete(u)}
                  />
                );
              })}
            </Flex>

            {loading ? (
              <p>loading...</p>
            ) : (
              searchResults.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    userData={user}
                    handleClick={() => handleGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              isLoading={loading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="whatsapp"
              onClick={handleSubmit}
              isLoading={loading}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
