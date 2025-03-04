import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { MotionAnimate } from 'react-motion-animate';
import { useSelector } from 'react-redux';

const User = ({ values, accessChat }) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const [userPic, setUserPic] = useState('');

    const handleAccessChat = () => {
        accessChat(values);
    };

    const getImageUrl = (pic) => {
        if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
        if (pic.startsWith('http')) return pic;
        return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
    };

    useEffect(() => {
        if (values.pic) {
            setUserPic(getImageUrl(values.pic));
        }
    }, [values]);

    return (
        <MotionAnimate reset={true}>
            <div 
                onClick={handleAccessChat} 
                className='flex flex-row box-border cursor-pointer items-center mt-2 hover:bg-gray-100 py-1 px-1'
            >
                <Avatar 
                    referrerPolicy="no-referrer" 
                    alt="User-pic" 
                    sx={{ width: 48, height: 48 }} 
                    src={userPic} 
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
