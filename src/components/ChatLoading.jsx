import { Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <>
      <Stack>
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
        <Skeleton height="50px" />
      </Stack>
    </>
  );
};

export default ChatLoading;
