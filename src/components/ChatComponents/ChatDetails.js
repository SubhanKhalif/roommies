import React, { useRef, useState } from "react";
import { Box, Modal } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getSender, getUsersLeavingMe } from "../../helper/Reusable.js";
import GroupUserList from "./GroupUserList.js";
import { Cancel as CancelIcon } from "@mui/icons-material";
import User from "./User.js";
import Loading from "./Loading.js";
import {
  RenameGlobalChat,
  addNewUserToGroup,
  addNewUserToActive,
  RenameChat,
  removeUserFromGroup,
  removeUserFromActive,
  NullifyActiveChat,
  removeChat
} from "../../services/Actions/Chat/action.js";
import { ToastContainer, toast } from "react-toastify";
import { socket } from "../../socket/socket.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: window.innerWidth / 3,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "14px",
  p: 4,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  outline: "none",
};

export default function ChatDetails({ chatModel, closeChat }) {
  const activeUser = useSelector((state) => state.chat.activeChat);
  const dispatch = useDispatch();
  const ref = useRef();
  const [results, setResults] = useState([]);
  const [isEmptyResults, setIsEmptyResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!activeUser) return null;

  const data = activeUser.isGroupChat ? activeUser : getSender(activeUser.users);

  const notify = (errorname, value) => {
    const options = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };

    return toast.error(
      errorname === "error" ? value : errorname,
      {
        ...options,
        position: errorname === "error" ? "top-right" : "top-center",
        autoClose: errorname === "error" ? 5000 : 2222
      }
    );
  };

  const closeModelHandler = () => {
    setResults([]);
    closeChat();
  };

  const searchHandler = async (value) => {
    setIsLoading(true);
    try {
      const cookie = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/users?search=${value}`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      const data = await response.json();
      data.users.length = Math.min(data.users.length, 2);
      setResults(data.users);
      setIsEmptyResults(data.users.length === 0);
    } finally {
      setIsLoading(false);
    }
  };

  const inputHandler = (e) => {
    setTimeout(() => searchHandler(e.target.value), 2000);
  };

  const updateInfo = async () => {
    const cookie = localStorage.getItem("jwt");
    const bodyData = {
      chatId: activeUser._id,
      chatName: ref.current.value,
    };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat/rename`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify(bodyData),
    });
    const data = await response.json();
    if (data.status === "success") {
      closeChat();
      dispatch(RenameChat(ref.current.value));
      dispatch(RenameGlobalChat(ref.current.value, activeUser._id));
    }
  };

  const addHandler = async (user) => {
    const cookie = localStorage.getItem("jwt");
    const bodyData = {
      chatId: activeUser._id,
      userId: user._id,
    };
    const loggedUser = JSON.parse(localStorage.getItem("info"));
    
    if (loggedUser._id !== activeUser.groupAdmin._id) {
      return notify("Only administrators are allowed to add new users.");
    }

    if (activeUser.users.some(data => data._id === user._id)) {
      return notify("error", "User already in the group!");
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat/groupadd`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify(bodyData),
    });
    const data = await response.json();
    if (data.status === "success") {
      dispatch(addNewUserToGroup(user, activeUser._id));
      dispatch(addNewUserToActive(user));
    }
  };

  const removeHandler = async (userId) => {
    const cookie = localStorage.getItem("jwt");
    const bodyData = {
      chatId: activeUser._id,
      userId: userId,
    };
    const loggedUser = JSON.parse(localStorage.getItem("info"));
    
    if (loggedUser._id !== activeUser.groupAdmin._id) {
      return notify("Only administrators are allowed to remove users.");
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/chat/groupremove`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${cookie}`,
        },
        body: JSON.stringify(bodyData),
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      dispatch(removeUserFromGroup(userId, activeUser._id));
      dispatch(removeUserFromActive(userId));
    }
  };

  const deleteChatHandler = () => {
    const deleteData = async () => {
      const bodyData = {
        chatId: activeUser._id,
      };
      const cookie = localStorage.getItem("jwt");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/chat/deleteChat`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${cookie}`,
          },
          body: JSON.stringify(bodyData),
        }
      );
      socket.emit("removechatbar-send", activeUser._id);
      dispatch(NullifyActiveChat());
      dispatch(removeChat(activeUser._id));
    };

    const loggedUser = JSON.parse(localStorage.getItem("info"));
    if (activeUser.isGroupChat && loggedUser._id !== activeUser.groupAdmin._id) {
      return notify("Only administrators are allowed to delete the group.");
    }
    deleteData();
    closeModelHandler();
  };

  return (
    <div className="absolute">
      <ToastContainer />
      <Modal
        open={chatModel}
        onClose={closeChat}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-2xl font-Poppins">Info</div>
          <div className="flex w-[100%]">
            <input
              ref={ref}
              defaultValue={data.isGroupChat ? data.chatName : data.name}
              disabled={!data.isGroupChat}
              spellCheck="false"
              placeholder="Chat Name"
              className="text-lg h-[16%] w-[100%] mt-5 font-thin px-1 py-2 outline-none bg-[#F6F8FC]"
            />
            {data.isGroupChat && (
              <button
                onClick={updateInfo}
                className="bg-[#014DFE] text-white text-lg ml-2 px-2 py-1 mt-4 rounded-sm"
              >
                Change
              </button>
            )}
          </div>
          {data.isGroupChat && (
            <input
              onChange={inputHandler}
              spellCheck="false"
              placeholder="Add your Friends"
              className="text-lg h-[16%] w-[100%] px-1 py-2 mt-3 outline-none font-thin bg-[#F6F8FC]"
            />
          )}
          {data.isGroupChat && (
            <div className="w-[100%]">
              {!isLoading && results?.length > 0 && results.map((data, index) => (
                <User add={addHandler} values={data} key={index} />
              ))}
              {!isLoading && isEmptyResults && <p>No results found</p>}
              {isLoading && <Loading />}
              <GroupUserList
                remove={removeHandler}
                users={getUsersLeavingMe(data.users)}
              />
            </div>
          )}
          <div>
            <button
              onClick={closeModelHandler}
              className="text-[#0147FF] text-xl border-[2px] border-[#0147FF] px-4 py-1 ml-2 mt-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={deleteChatHandler}
              className="bg-[#EF5350] text-white text-lg  ml-2 px-2 py-1.5 mt-4 rounded-lg"
            >
              <CancelIcon className="mr-2"></CancelIcon>
              {data.isGroupChat ? "Delete Group" : "Delete Chat"}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
