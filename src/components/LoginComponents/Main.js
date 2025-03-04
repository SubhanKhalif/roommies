import React, { useState } from 'react';
import { Link, useSubmit } from 'react-router-dom';
import Input from './Input.js';
import Square from './Square.js';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { validate } from 'react-email-validator';
import CircularProgress from '@mui/material/CircularProgress/index.js';
import Box from '@mui/material/Box/index.js';
import { Button, Paper, Typography, IconButton } from '@mui/material/index.js';
import { LockOpen, Visibility, VisibilityOff } from '@mui/icons-material/index.js';
import { toast } from 'react-toastify';
import { FaArrowCircleLeft } from 'react-icons/fa/index.js';

const Main = () => {
  const submit = useSubmit();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitData = async (e, googleAuth, information) => {
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 5000);

    if (googleAuth) {
      const { name, picture: pic } = information;
      submit({ ...googleAuth, name, pic }, { method: 'post' });
      return;
    }

    e.preventDefault();
    if (!loginData.email || !validate(loginData.email) || !loginData.password) {
      return toast.error('Please enter valid email and password', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
    submit(loginData, { method: 'post' });
  };

  const handleGoogleSuccess = (response) => {
    const token = response.credential;
    const decoded = jwt_decode(token);
    setLoginData({ email: decoded.email, password: decoded.sub });
    handleSubmitData(1, { email: decoded.email, password: decoded.sub }, { ...decoded });
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const preventDefault = (event) => event.preventDefault();

  return (
    <div className='flex flex-col items-center h-[100vh] w-[100vw] relative overflow-hidden px-2'>
      <Square />
      <Square isRight />
      <Paper className='z-20 w-full max-w-[370px] p-[2rem] my-auto' elevation={3}>
        <Link to='/'>
          <FaArrowCircleLeft className='text-blue-600 cursor-pointer text-2xl' />
        </Link>
        <div className='font-Poppins text-3xl font-extrabold flex items-center flex-col'>
          <LockOpen fontSize='large' color='primary' />
          <Typography variant='h5'>Log In</Typography>
        </div>
        <br />
        <hr />
        <form className='mt-6 relative'>
          <Input onSetData={setLoginData} name='email' text='Email ID' placeholder='Email address' type='text' />
          <div className='relative'>
            <Input
              onSetData={setLoginData}
              name='password'
              text='Password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
            />
            <IconButton
              aria-label='toggle password visibility'
              onClick={togglePasswordVisibility}
              onMouseDown={preventDefault}
              edge='end'
              style={{ position: 'absolute', right: '10px', top: '70%', transform: 'translateY(-50%)' }}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </div>
          <div className='flex flex-row justify-center mt-10'>
            <Button sx={{ padding: '.5rem 4rem' }} onClick={handleSubmitData} variant='contained'>
              {submitting ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress size={25} style={{ color: '#FFFFFF' }} />
                </Box>
              ) : (
                'LOG IN'
              )}
            </Button>
          </div>
          <Typography className='text-center py-3'>
            Don't have an account?{' '}
            <Link className='text-blue-600' to='/signup'>
              SignUp
            </Link>
          </Typography>
          <div className='h-[1px] w-[100%] mt-10 bg-[#808080]' />
          <div className='flex flex-col items-center mt-6'>
            <div className='mt-[2%]'>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Main;
