import { jwtDecode } from "jwt-decode";

// get sender name
export const getSender = (loggedUser, users) => {
  const token = loggedUser.token;
  const decoded = jwtDecode(token);

  return users[0]._id === decoded._id ? users[1].name : users[0].name;
};

// get sender data
export const getSenderFull = (loggedUser, selectedChat) => {
  if (!selectedChat) return;

  const { users } = selectedChat;
  const token = loggedUser.token;
  const decoded = jwtDecode(token);

  return users[0]._id === decoded._id ? users[1] : users[0];
};

// get sender picture
export const getSenderPic = (loggedUser, users) => {
  const token = loggedUser.token;
  const decoded = jwtDecode(token);

  return users[0]._id === decoded._id ? users[1].pic : users[0].pic;
};

// is same sender
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// is last message
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// format time
export const formatTime = (time) => {
  if (time < 10) return "0" + time.toString();
  return time;
};
