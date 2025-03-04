import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MotionAnimate } from 'react-motion-animate';
import TopBar from '../components/ChatComponents/TopBar.js';
import ChatBar from '../components/ChatComponents/ChatBar.js';
import ChatTitle from '../components/ChatComponents/ChatTitle.js';
import ChatMessages from '../components/ChatComponents/ChatMessages.js';
import Type from '../components/ChatComponents/Type.js';
import BasicModal from '../components/ChatComponents/BasicModel.js';
import ChatDetails from '../components/ChatComponents/ChatDetails.js';
import Loading from './util/Loading.js';
import NoChats from './util/NoChats.js';
import { socket } from '../socket/socket.js';
import { 
  InitializeChat, 
  SetActiveChat, 
  removeChat, 
  NullifyActiveChat,
  ClearSelectedUserId
} from '../services/Actions/Chat/action.js';

const HomeChat = () => {
  const { AllChats: state, selectedUserId } = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const location = useLocation();
  
  const [chatModel, setChatModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const handleRemoveChat = (chatId) => {
      dispatch(removeChat(chatId));
      dispatch(NullifyActiveChat());
    };

    socket.on('removechatbar-recieve', handleRemoveChat);
    return () => {
      socket.off('removechatbar', handleRemoveChat);
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchChats = async () => {
      if (state.length > 0) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat`, {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const { data } = await response.json();
        setIsEmpty(data.length === 0);
        dispatch(InitializeChat(data));

        if (selectedUserId) {
          // Find chat with this user or create a new one
          const existingChat = data.find(chat => 
            chat.users.some(user => user._id === selectedUserId)
          );
          
          if (existingChat) {
            dispatch(SetActiveChat(existingChat));
          } else {
            // Create new chat
            try {
              const createChatResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/chat`, {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: selectedUserId }),
              });
              const newChat = await createChatResponse.json();
              if (newChat.data) {
                dispatch(InitializeChat([...data, newChat.data]));
                dispatch(SetActiveChat(newChat.data));
              }
            } catch (error) {
              console.error('Error creating new chat:', error);
            }
          }
          // Clear the selected user ID after handling it
          dispatch(ClearSelectedUserId());
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [dispatch, state.length, selectedUserId]);

  const selectChat = (data) => {
    dispatch(SetActiveChat(data));
  };

  return (
    <div className="grid max-[1250px]:w-[82vw] max-[1024px]:w-[92vw] max-[1250px]:grid-cols-[4.5fr,7fr] max-[900px]:grid-cols-[5.5fr,7fr] w-[80vw] relative grid-rows-[1fr,7fr] grid-cols-[3.5fr,7fr]">
      <BasicModal handleClose={handleClose} open={open} />
      <ChatDetails closeChat={() => setChatModel(false)} chatModel={chatModel} />
      
      <TopBar createGroup={handleOpen} />
      
      <div className="flex flex-row items-center border-[1px] border-[#f5f5f5]">
        <ChatTitle openChatModel={() => setChatModel(true)} />
      </div>

      <div className="border-[1px] overflow-y-scroll no-scrollbar border-[#f5f5f5]">
        {isLoading && <Loading />}
        {!isLoading && state?.map((data, index) => (
          <MotionAnimate key={index} animation="fadeInUp">
            <ChatBar select={selectChat} data={data} />
          </MotionAnimate>
        ))}
        {isEmpty && state.length === 0 && <NoChats />}
      </div>

      <div className="bg-[#F6F8FC] flex flex-col relative overflow-hidden">
        <ChatMessages />
        <Type />
      </div>
    </div>
  );
};

export default HomeChat;
