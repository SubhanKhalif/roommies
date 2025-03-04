import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { MotionAnimate } from 'react-motion-animate';

const User = ({ values, add }) => {
  const [imageUrl, setImageUrl] = useState('');

  const clickHandler = () => {
    add(values);
  };

  const getImageUrl = (pic) => {
    if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    if (pic.startsWith("http")) return pic;
    return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
  };

  useEffect(() => {
    setImageUrl(getImageUrl(values.pic));
  }, [values.pic]);

  return (
    <MotionAnimate reset={true}>
      <div 
        onClick={clickHandler} 
        className='flex flex-row box-border cursor-pointer items-center mt-2 hover:bg-gray-100 py-1 px-1'
      >
        <Avatar 
          referrerPolicy="no-referrer" 
          alt={values.name || "User-pic"}
          sx={{ width: 48, height: 48 }} 
          src={imageUrl}
        />
        <div className='flex flex-col ml-2'>
          <div className='font-bold font-Roboto text-sm'>{values.name}</div>
          <div className="text-xs text-[#979797]">{values.email}</div>
        </div>
      </div>
    </MotionAnimate>
  );
};

export default User;
