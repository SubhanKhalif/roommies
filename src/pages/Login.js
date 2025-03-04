import React from 'react';
import Main from '../components/LoginComponents/Main.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = (message) => toast.error(message, {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
});

const Login = () => (
  <GoogleOAuthProvider clientId="438058612514-mr6pvrfg97crajaid4grj88l95vo8u82.apps.googleusercontent.com">
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <Main />
  </GoogleOAuthProvider>
);

export const action = async ({ request }) => {
  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
    pic: data.get('pic'),
  };

  const isGoogleAuth = data.get('name');
  
  if (isGoogleAuth) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/login`, {
      method: request.method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(authData),
    });

    const responseData = await response.json();

    if (responseData.status !== 'fail') {
      localStorage.setItem('jwt', responseData.token);
      return redirect('/home/landing');
    }

    const authData2 = { ...authData, name: isGoogleAuth };
    const response2 = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/signup`, {
      method: request.method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(authData2),
    });

    const responseData2 = await response2.json();

    if (responseData2.status === 'fail') {
      notify('Something went wrong');
      return null;
    }

    localStorage.setItem('jwt', responseData2.token);
    return redirect('/home/landing');
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/login`, {
    method: request.method,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  const responseData = await response.json();

  if (responseData.status === 'fail') {
    notify('Something went wrong');
    return null;
  }

  localStorage.setItem('jwt', responseData.token);
  return redirect('/home/landing');
};

export default Login;