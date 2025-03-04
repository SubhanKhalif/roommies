import React from 'react';
import Main from '../components/SignupComponents/Main.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => (
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

const notify = (message) => toast.error(message, {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
});

export const action = async ({ request }) => {
  const data = await request.formData();
  const authData = {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
  };

  const isGoogleSignIn = data.get('isGoogle');
  
  if (isGoogleSignIn) {
    const googleData = { ...authData, pic: data.get('pic') };
    const googleResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/ispresent`, {
      method: request.method,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(googleData),
    });

    const googleResponseData = await googleResponse.json();
    if (googleResponseData.status === 'success') {
      localStorage.setItem('jwt', googleResponseData.token);
      return redirect('/home/landing');
    }
  }

  const information = isGoogleSignIn ? { ...authData, pic: data.get('pic') } : authData;
  
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/signup`, {
    method: request.method,
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(information),
  });

  const responseData = await response.json();

  if (responseData.status === 'fail') {
    notify('Something went wrong');
    return null;
  }

  localStorage.setItem('jwt', responseData.token);
  return redirect('/home/landing');
};

export default Signup;
