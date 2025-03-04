import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { NullifyActiveChat, FlushAllChats } from '../../services/Actions/Chat/action.js';

const UserCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  
  const [name, setName] = useState('');
  const [pic, setPic] = useState('');

  const getImageUrl = (pic) => {
    if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    if (pic.startsWith('http')) return pic;
    return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setPic(getImageUrl(userInfo.pic));
    }
  }, [userInfo]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/', { replace: true });
    dispatch(NullifyActiveChat());
    dispatch(FlushAllChats());
  };

  return (
    <div className='flex flex-row items-center ml-[10%] max-[1024px]:hidden'>
      <Avatar 
        referrerPolicy="no-referrer" 
        alt="User-pic" 
        sx={{ width: 48, height: 48 }} 
        src={pic} 
      />
      <div className='flex flex-col ml-2'>
        <div className='max-[1250px]:text-[12px] font-bold font-Roboto text-sm'>
          {name}
        </div>
        <div 
          onClick={handleLogout} 
          className="max-[1250px]:text-[10px] text-xs cursor-pointer text-[#979797]"
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserCard;
