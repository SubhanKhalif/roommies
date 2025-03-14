import React from 'react';
import Title from '../ChatComponents/Title.js';
import { SearchOutlined, Group } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ createGroup }) => {
  const navigate = useNavigate();

  const moveToSearchHandler = () => {
    navigate('/home/search', { replace: true });
  };

  return (
    <div className='flex flex-row px-[5%] items-center justify-between box-border'>
      <Title title='Messages' />
      <div className='flex flex-row'>
        <div 
          onClick={createGroup} 
          className='cursor-pointer hover:bg-gray-200 h-10 w-10 bg-gray-100 flex flex-row items-center rounded-full justify-center'
        >
          <Group color="action" />
        </div>
        <div 
          onClick={moveToSearchHandler}  
          className='cursor-pointer hover:bg-gray-200 h-10 ml-2 w-10 bg-gray-100 flex flex-row items-center rounded-full justify-center'
        >
          <SearchOutlined color="action" />
        </div>
      </div>
    </div> 
  );
};

export default TopBar;
