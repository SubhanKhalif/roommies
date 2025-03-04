import { useState, useEffect } from 'react';
import Input from '../LoginComponents/Input.js';
import Square from '../LoginComponents/Square.js';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { Link, useNavigation, useSubmit } from 'react-router-dom';
import { validate } from 'react-email-validator';
import { CircularProgress, Box, Button, Paper, Typography, IconButton } from '@mui/material';
import { HowToReg, Visibility, VisibilityOff, CheckCircle, Cancel, ArrowBack } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';

const PasswordRequirements = ({ password }) => {
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numberRegex = /[0-9]/;
  const uppercaseRegex = /[A-Z]/;

  const boxStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '8px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div style={boxStyle}>
      <ul>
        <li style={{ color: password.length >= 8 && password.length <= 12 ? 'green' : 'red' }}>
          {password.length >= 8 && password.length <= 12 ? <CheckCircle /> : <Cancel />} 8-12 characters
        </li>
        <li style={{ color: numberRegex.test(password) ? 'green' : 'red' }}>
          {numberRegex.test(password) ? <CheckCircle /> : <Cancel />} At least one number
        </li>
        <li style={{ color: uppercaseRegex.test(password) ? 'green' : 'red' }}>
          {uppercaseRegex.test(password) ? <CheckCircle /> : <Cancel />} At least one uppercase letter
        </li>
        <li style={{ color: specialCharacterRegex.test(password) ? 'green' : 'red' }}>
          {specialCharacterRegex.test(password) ? <CheckCircle /> : <Cancel />} At least one special character
        </li>
      </ul>
    </div>
  );
};

const Main = () => {
  const navigation = useNavigation();
  const submit = useSubmit();
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  useEffect(() => {
    // Update the component when password changes
  }, [signUpData.password]);

  const sendData = (e, googleauth) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 5000);

    if (googleauth) {
      submit(googleauth, { method: 'post' });
      return;
    }

    e.preventDefault();
    setShowPasswordRequirements(true);

    if (!signUpData.email || !signUpData.password) {
      return toast.error('Please fill all required fields', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }

    if (!validate(signUpData.email)) {
      return toast.error('Please enter a valid email', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }

    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;
    const uppercaseRegex = /[A-Z]/;

    const passwordErrors = [
      { condition: signUpData.password.length < 8, message: 'Password must be at least 8 characters' },
      { condition: signUpData.password.length > 12, message: 'Password must be no more than 12 characters' },
      { condition: !numberRegex.test(signUpData.password), message: 'Password must contain at least one number' },
      { condition: !uppercaseRegex.test(signUpData.password), message: 'Password must contain at least one uppercase letter' },
      { condition: !specialCharacterRegex.test(signUpData.password), message: 'Password must contain at least one special character' }
    ];

    const error = passwordErrors.find(err => err.condition);
    if (error) {
      return toast.error(error.message, {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }

    submit(signUpData, { method: 'post' });
  };

  const responseMessage = (response) => {
    const token = response.credential;
    const decoded = jwt_decode(token);
    setSignUpData({ name: decoded.name, email: decoded.email, password: decoded.sub });
    sendData(null, { name: decoded.name, email: decoded.email, password: decoded.sub, isGoogle: true, pic: decoded.picture });
  };

  const errorMessage = (error) => {
    console.error(error);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div className='flex flex-col items-center h-[100vh] w-[100vw] relative overflow-hidden px-2'>
      <Square />
      <Square isRight={true} />
      <Paper className='z-20 w-full max-w-[370px] p-[2rem] my-auto' elevation={3}>
        <Link to="/"><ArrowBack className="text-blue-600 cursor-pointer text-2xl" /></Link>
        <div className='font-Poppins text-3xl font-extrabold flex items-center flex-col'>
          <HowToReg fontSize='large' color='primary' />
          <Typography variant='h5'>Sign Up</Typography>
        </div>
        <br />
        <hr />
        <form className='mt-6 relative'>
          <Input onSetData={setSignUpData} name='name' text='Name' placeholder='Enter your name' type='text' />
          <Input onSetData={setSignUpData} name='email' text="Email ID" placeholder="Enter Email Address" type='text' />
          <div className='relative'>
            <div className='relative'>
              <Input
                onSetData={setSignUpData}
                name='password'
                text='Password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
              />
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
                style={{ position: 'absolute', right: '10px', top: '71%', transform: 'translateY(-50%)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            {showPasswordRequirements && <PasswordRequirements password={signUpData.password} />}
          </div>
          <div className='flex flex-row justify-center mt-8'>
            <Button sx={{ padding: '.5rem 4rem' }} onClick={sendData} variant="contained">
              {!submitting && <div>SIGN UP</div>}
              {submitting && <Box sx={{ display: 'flex' }}>
                <CircularProgress size={25} style={{ color: 'white' }} />
              </Box>}
            </Button>
          </div>
          <Typography className='text-center py-3'>Already have an account? <Link className='text-blue-600' to="/login">LogIn</Link></Typography>
          <div className='h-[1px] w-[100%] mt-4 bg-[#808080]' />
          <div className='flex flex-col items-center mt-6'>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Main;
