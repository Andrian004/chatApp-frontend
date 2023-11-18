import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ userData, handleClick }) => {
  return (
    <>
      <Box
        onClick={handleClick}
        cursor="pointer"
        bg="gray.100"
        _hover={{ background: "green.400", color: "white" }}
        color="black"
        w="100%"
        display="flex"
        alignItems="center"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={userData.name}
          src={userData.pic}
        />
        <Box>
          <Text>{userData.name}</Text>
          <Text fontSize="xs">
            <b>Email: </b>
            {userData.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
