import React from 'react';
import { Chip, Avatar } from '@mui/material';

const ChipExtend = ({ value, remove }) => {
  const handleDelete = () => {
    remove(value._id);
  };

  const avatarSrc = value.pic.startsWith('user') 
    ? `${process.env.REACT_APP_API_URL}/${value.pic}`
    : value.pic;

  const chipStyle = {
    color: 'black',
    fontSize: '14px',
    fontWeight: 'bold',
    marginLeft: '5px',
    marginTop: '5px'
  };

  return (
    <Chip
      color="primary"
      style={chipStyle}
      avatar={
        <Avatar 
          referrerPolicy="no-referrer" 
          alt="Natacha" 
          src={avatarSrc} 
        />
      }
      onDelete={handleDelete}
      label={value.name.split(' ')[0]}
      variant="outlined"
    />
  );
};

export default ChipExtend;
