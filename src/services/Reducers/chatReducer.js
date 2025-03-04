const initialState = {
  AllChats: [],
  activeChat: null,
  activeChatMessages: [],
  selectedUserId: null
};

const chatReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "ADD_USER": {
      const exists = state.AllChats.some(chat => chat._id === payload._id);
      return exists ? state : {
        ...state,
        AllChats: [payload, ...state.AllChats]
      };
    }

    case "INIT_CHATS":
      return { ...state, AllChats: payload };

    case "ADD_GROUP":
      return { ...state, AllChats: [payload, ...state.AllChats] };

    case "ACTIVE_CHAT":
      return { ...state, activeChat: payload };

    case "FLUSH_CHATS":
      return { ...state, AllChats: [] };

    case "ADD_USER_GROUP":
      return {
        ...state,
        AllChats: state.AllChats.map(chat => 
          chat._id === payload.activeChatId 
            ? { ...chat, users: [...chat.users, payload.user] }
            : chat
        )
      };

    case "REMOVE_USER_GROUP":
      return {
        ...state,
        AllChats: state.AllChats.map(chat => 
          chat._id === payload.activeChatId
            ? { ...chat, users: chat.users.filter(user => user._id !== payload.userId) }
            : chat
        )
      };

    case "REMOVE_USER_ACTIVE":
      return {
        ...state,
        activeChat: {
          ...state.activeChat,
          users: state.activeChat.users.filter(user => user._id !== payload)
        }
      };

    case "ADD_USER_ACTIVE":
      return {
        ...state,
        activeChat: {
          ...state.activeChat,
          users: [...state.activeChat.users, payload]
        }
      };

    case "EDIT_ACTIVE_CHAT":
      return {
        ...state,
        activeChat: {
          ...state.activeChat,
          chatName: payload
        }
      };

    case "RENAME_CHAT":
      return {
        ...state,
        AllChats: state.AllChats.map(chat => 
          chat._id === payload.id 
            ? { ...chat, chatName: payload.name } 
            : chat
        )
      };

    case "NULL_ACTIVE_CHAT":
      return { ...state, activeChat: null };

    case "INIT_CHAT_MESSAGES":
      return { ...state, activeChatMessages: payload };

    case "ADD_MESSAGE":
      return { ...state, activeChatMessages: [...state.activeChatMessages, payload] };

    case "REMOVE_CHAT":
      return {
        ...state,
        AllChats: state.AllChats.filter(chat => chat._id !== payload)
      };

    case "CHAT_NOTIFY":
      return {
        ...state,
        AllChats: state.AllChats.map(chat => 
          chat._id === payload 
            ? { ...chat, notify: true } 
            : chat
        )
      };

    case "MOVE_TO_TOP_CHAT": {
      const chatToMove = state.AllChats.find(chat => chat._id === payload);
      if (!chatToMove) return state;
      
      return {
        ...state,
        AllChats: [
          chatToMove,
          ...state.AllChats.filter(chat => chat._id !== payload)
        ]
      };
    }

    case "INACT_CHAT_NOTIFY":
      return {
        ...state,
        AllChats: state.AllChats.map(chat => {
          if (chat._id === payload) {
            const { notify, ...rest } = chat;
            return rest;
          }
          return chat;
        })
      };

    case "UPDATE_CHAT_BAR": {
      const currentDate = new Date().toISOString();
      return {
        ...state,
        AllChats: state.AllChats.map(chat => 
          chat._id === payload.id
            ? { 
                ...chat, 
                latestMessage: { ...chat.latestMessage, content: payload.latestMessage },
                updatedAt: currentDate
              }
            : chat
        )
      };
    }

    case "ADD_INCOMING_USER_CHAT":
      return {
        ...state,
        AllChats: [payload, ...state.AllChats]
      };

    case "SET_SELECTED_USER_ID":
      return {
        ...state,
        selectedUserId: payload
      };

    case "CLEAR_SELECTED_USER_ID":
      return {
        ...state,
        selectedUserId: null
      };

    default:
      return state;
  }
};

export default chatReducer;
