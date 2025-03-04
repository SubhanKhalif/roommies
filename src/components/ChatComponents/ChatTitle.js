import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { MoreHorizOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getSender } from "../../helper/Reusable.js";
import { socket } from "../../socket/socket.js";
import groupLogo from '../../assets/images/group.png';

const getImageUrl = (pic) => {
  if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  if (pic.startsWith("http")) return pic;
  return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
};

const ChatTitle = ({ openChatModel }) => {
  const data = useSelector((state) => state.chat.activeChat);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!data) return;

    const setTypeHandler = (room) => {
      setIsTyping(data._id === room);
    };

    const unsetTypeHandler = () => {
      setIsTyping(false);
    };

    socket.on("typing", setTypeHandler);
    socket.on("stop typing", unsetTypeHandler);

    return () => {
      socket.off("typing", setTypeHandler);
      socket.off("stop typing", unsetTypeHandler);
    };
  }, [data]);

  if (!data) return null;

  const isGroupChat = data.isGroupChat;
  const user = isGroupChat 
    ? { name: data.chatName } 
    : getSender(data.users);

  return (
    <div className="flex flex-row items-center px-[5%] box-border justify-between w-[100%]">
      <div className="flex flex-row items-center">
        <Avatar
          referrerPolicy="no-referrer"
          alt="Group-pic"
          sx={{ width: 48, height: 48 }}
          src={
            isGroupChat 
              ? groupLogo 
              : getImageUrl(user.pic)
          }
        />
        <div className="flex flex-col ml-3">
          <div className="text-xl font-Roboto font-semibold">{user.name}</div>
          {isTyping && (
            <div className="text-xs font-normal text-[#30C730]">
              {isGroupChat ? "Someone" : user.name} is typing...
            </div>
          )}
        </div>
      </div>
      <div onClick={openChatModel}>
        <MoreHorizOutlined
          style={{ cursor: "pointer" }}
          color="action"
        />
      </div>
    </div>
  );
};

export default ChatTitle;
