import { Avatar } from "@mui/material";
import { isSameUser } from "../../helper/Reusable.js";
import { Tooltip } from "@mui/material";

const ReceiverMessage = ({
  img,
  content,
  messages,
  index,
  name,
  isGroupChat,
  time,
}) => {
  const messageTime = new Date(time);
  
  const formatTime = (date) => {
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'pm' : 'am';
    return `${hours}:${minutes} ${period}`;
  };

  if (isSameUser(messages, index) && isGroupChat) {
    return (
      <div className="flex flex-row justify-start my-1">
        <div className="bg-[#7c6464] rounded-tr-xl ml-[45px] font-Roboto rounded-br-xl rounded-bl-xl box-border px-2 py-2 max-[900px]:text-sm flex justify-between">
          <div>{content}</div>
          <p className="text-[11px] pl-2 pt-3 flex items-end font-medium">
            {formatTime(messageTime)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[60%]">
      <div className="flex flex-row justify-start my-1">
        {isGroupChat && (
          <Tooltip title={name} arrow placement="top-start">
            <Avatar
              referrerPolicy="no-referrer"
              src={
                img.startsWith("user")
                  ? `${process.env.REACT_APP_API_URL}/${img}`
                  : img
              }
            />
          </Tooltip>
        )}
        <div className="bg-[#FFFFFF] max-w-[100%] relative rounded-tr-lg ml-[1%] font-Roboto rounded-br-lg rounded-bl-lg box-border px-2 pt-2 pb-2 flex flex-col items-end max-[900px]:text-sm">
          <p className="w-[100%] min-w-[50px] pe-5 pb-2" style={{wordWrap:"break-word"}}>
            {content}
          </p>
          <p className="absolute bottom-[3px] right-2 text-[9px] pl-2 flex items-end font-medium">
            {formatTime(messageTime)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiverMessage;
