import React from 'react';
import { TextField } from '@mui/material';

const InputName = ({ name, setName }) => {
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <TextField
      value={name}
      onChange={handleNameChange}
      id="outlined-read-only-input"
      label="Name"
      style={{ width: '40%' }}
    />
  );
};

export default InputName;
