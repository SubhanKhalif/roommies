import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSound from 'use-sound';
import { format, isToday, isYesterday } from 'date-fns';
import RecieverMessage from './RecieverMessage.js';
import SenderMessage from './SenderMessage.js';
import Advertisement from './Advertisement.js';
import CircularLoading from './CircularLoading.js';
import EmptyMessages from './EmptyMessages.js';
import { isSender } from '../../helper/Reusable.js';
import { socket } from '../../socket/socket.js';
import { 
  InitializeChatMessages,
  AddMessage,
  moveChatToTop,
  updateChatBar,
  addIncomingUserChatBar
} from '../../services/Actions/Chat/action.js';
import notifySound from '../../assets/sounds/notification.mp3';

const ChatMessages = () => {
  const isSet = useSelector(state => state.chat.activeChat);
  const AllChats = useSelector(state => state.chat.AllChats);
  const [isLoading, setIsLoading] = useState(false);
  const data = useSelector(state => state.chat.activeChatMessages);
  const div = useRef(null);
  const dispatch = useDispatch();
  const [play] = useSound(notifySound);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('info'));
    socket.emit('setup', loggedUser);
  }, []);

  useEffect(() => {
    const messageFn = (newMessageRecieved) => {
      const isChatBarPresent = AllChats.find(
        val => val._id === newMessageRecieved.chat._id
      );
      
      if (!isChatBarPresent) {
        dispatch(addIncomingUserChatBar(newMessageRecieved.chat));
        dispatch(updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content));
        return;
      }

      play();
      
      if (isSet !== null && isSet._id !== newMessageRecieved.chat._id) {
        dispatch(moveChatToTop(newMessageRecieved.chat._id));
        dispatch(updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content));
      } else if (isSet !== null && isSet._id === newMessageRecieved.chat._id) {
        dispatch(AddMessage(newMessageRecieved));
        dispatch(moveChatToTop(newMessageRecieved.chat._id));
        dispatch(updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content));
      } else if (isSet === null) {
        dispatch(moveChatToTop(newMessageRecieved.chat._id));
        dispatch(updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content));
      }
    };

    socket.on('message recieved', messageFn);
    return () => socket.off('message recieved', messageFn);
  }, [isSet, dispatch, AllChats]);

  useEffect(() => {
    if (isSet === null) return;

    const getData = async () => {
      setIsLoading(true);
      const cookie = localStorage.getItem('jwt');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/message/${isSet._id}`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${cookie}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 'success') {
        dispatch(InitializeChatMessages(data.message));
      }
      setIsLoading(false);
    };
    getData();
  }, [isSet, dispatch]);

  useEffect(() => {
    if (data.length === 0) return;

    let timer;
    if (div.current) {
      timer = setTimeout(() => {
        div.current.scrollTop = div.current.scrollHeight;
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [data]);
  
  if (isSet === null) return <Advertisement />;
  
  const formatDateHeader = (date) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) return 'Today';
    if (isYesterday(messageDate)) return 'Yesterday';
    return format(messageDate, 'd MMMM yyyy');
  };

  const isMessageNewDay = (current, previous) =>
    !previous || formatDateHeader(current.createdAt) !== formatDateHeader(previous.createdAt);

  return (
    <div
      ref={div}
      className="w-[100%] h-[88%] px-[3%] overflow-y-scroll no-scrollbar py-[2%] box-border relative flex flex-col"
    >
      {isLoading && <CircularLoading />}
      {!isLoading && data.length === 0 && <EmptyMessages />}
      {!isLoading && data.length > 0 && (
        <>
          {data.map((val, index) => {
            const showDateHeader = isMessageNewDay(val, data[index - 1]);
            return (
              <div key={index}>
                {showDateHeader && (
                  <div className="flex justify-center">
                    <div className="rounded-md px-2.5 py-1.5 my-4 bg-slate-200 text-slate-600 font-normal text-sm">
                      {formatDateHeader(val.createdAt)}
                    </div>
                  </div>
                )}
                {isSender(val.sender._id) ? (
                  <SenderMessage
                    time={val.createdAt}
                    content={val.content}
                    key={index}
                  />
                ) : (
                  <RecieverMessage
                    isGroupChat={isSet.isGroupChat}
                    name={val.sender.name}
                    img={val.sender.pic}
                    messages={data}
                    index={index}
                    content={val.content}
                    time={val.createdAt}
                    key={index}
                  />
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ChatMessages;
