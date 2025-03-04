// export const AddUser = (user) => ({
//   type: "ADD_USER",
//   payload: {...user}
// });

export const AddUser = (user) => async (dispatch) => {
  const info = { userId: user._id };
  const cookie = localStorage.getItem('jwt');
  
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cookie}`
    },
    body: JSON.stringify(info)
  });
  
  const data = await response.json();
  
  dispatch({
    type: 'ADD_USER',
    payload: {...data}
  });
};

export const AddGroup = (group) => ({
  type: "ADD_GROUP",
  payload: group
});

export const InitializeChat = (chats) => ({
  type: "INIT_CHATS",
  payload: [...chats]
});

export const FlushAllChats = () => ({
  type: "FLUSH_CHATS"
});

export const SetActiveChat = (chatId) => ({
  type: "ACTIVE_CHAT",
  payload: chatId
});

export const updateChatDetails = (chatId) => ({
  type: "UPDATE_CHAT",
  payload: chatId
});

export const addNewUserToGroup = (user, activeChatId) => ({
  type: "ADD_USER_GROUP",
  payload: { user, activeChatId }
});

export const removeUserFromGroup = (userId, activeChatId) => ({
  type: "REMOVE_USER_GROUP",
  payload: { userId, activeChatId }
});

export const addNewUserToActive = (user) => ({
  type: "ADD_USER_ACTIVE",
  payload: user
});

export const removeUserFromActive = (userId) => ({
  type: "REMOVE_USER_ACTIVE",
  payload: userId
});

export const RenameChat = (name) => ({
  type: "EDIT_ACTIVE_CHAT",
  payload: name
});

export const RenameGlobalChat = (name, id) => ({
  type: "RENAME_CHAT",
  payload: { name, id }
});

export const NullifyActiveChat = () => ({
  type: "NULL_ACTIVE_CHAT"
});

export const InitializeChatMessages = (data) => ({
  type: "INIT_CHAT_MESSAGES",
  payload: data
});

export const AddMessage = (message) => ({
  type: "ADD_MESSAGE",
  payload: message
});

export const removeChat = (id) => ({
  type: "REMOVE_CHAT",
  payload: id
});

export const ActiveChatNotify = (chatId) => ({
  type: "CHAT_NOTIFY",
  payload: chatId
});

export const InActivateNotify = (chatId) => ({
  type: "INACT_CHAT_NOTIFY",
  payload: chatId
});

export const moveChatToTop = (chatId) => ({
  type: "MOVE_TO_TOP_CHAT",
  payload: chatId
});

export const updateChatBar = (chatId, latestMessage) => ({
  type: "UPDATE_CHAT_BAR",
  payload: { id: chatId, latestMessage }
});

export const addIncomingUserChatBar = (data) => ({
  type: "ADD_INCOMING_USER_CHAT",
  payload: data
});

export const SetSelectedUserId = (userId) => ({
  type: "SET_SELECTED_USER_ID",
  payload: userId
});

export const ClearSelectedUserId = () => ({
  type: "CLEAR_SELECTED_USER_ID"
});