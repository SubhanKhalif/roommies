import React from 'react';
import { Avatar } from '@mui/material';
import Badge from '../ChatComponents/util/Badge.js';
import { getSender } from '../../helper/Reusable.js';
import { useSelector } from 'react-redux';
import groupLogo from '../../assets/images/group.png';

const getImageUrl = (pic) => {
  if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  if (pic.startsWith("http")) return pic;
  return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
};

const ChatBar = ({ data, select }) => {
  const val = useSelector((state) => state.chat.activeChat);
  const isGroupChat = data.isGroupChat;
  const user = isGroupChat ? { name: data.chatName } : getSender(data.users);

  const latestMessage = data.latestMessage?.content.slice(0, 35) || '';
  const isExceeding = data.latestMessage?.content.length > 35;
  const dateObject = new Date(data.updatedAt);

  const handleClick = () => select(data);

  return (
    <div 
      style={{ backgroundColor: val?._id === data._id ? '#F3F4F6' : null }} 
      onClick={handleClick}
      className='flex flex-row items-center justify-between rounded-md cursor-pointer mx-[2%] my-[5%] hover:bg-gray-100 px-[5%] py-[2%]'
    >
      <div className='flex flex-row items-center'>
        <Avatar 
          alt="User-pic" 
          referrerPolicy="no-referrer"
          style={{ width: '48px', height: '48px' }}
          src={isGroupChat ? groupLogo : getImageUrl(user.pic)} 
        />
        <div className='flex flex-col ml-2'>
          <div className='font-bold font-Roboto text-sm'>{user.name}</div>
          <div className="text-xs text-[#979797]">
            {latestMessage}{isExceeding ? '.....' : ''}
          </div>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <div className='text-xs max-[800px]:hidden font-medium cursor-pointer text-[#979797]'>
          {`${String(dateObject.getHours() % 12 || 12).padStart(2, '0')}:${String(dateObject.getMinutes()).padStart(2, '0')} ${dateObject.getHours() >= 12 ? 'PM' : 'AM'}`}
        </div>
        <div className='mt-1'>
          {data.notify && <Badge>1</Badge>}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
