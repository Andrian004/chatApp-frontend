import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const UserBadge = ({ userData, handleClick }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      mx={1}
      mb={2}
      fontSize="12px"
      bg="green.300"
      cursor="pointer"
      onClick={handleClick}
    >
      {userData.name} <CloseIcon ms={2} />
    </Box>
  );
};

export default UserBadge;
