import React from 'react';
import { TextField } from '@mui/material';

const InputEmail = ({ email, setEmail }) => {
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <TextField
      id="outlined-read-only-input"
      label="Email"
      onChange={handleEmailChange}
      value={email}
      style={{ width: '40%' }}
    />
  );
};

export default InputEmail;
