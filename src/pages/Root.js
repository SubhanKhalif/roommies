import React, { useEffect } from 'react';
import logo from '../assets/images/send-mail.png';
import Title from '../components/ChatComponents/Title.js';
import Menu from '../components/RootComponents/Menu.js';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import UserCard from '../components/RootComponents/UserCard.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../services/Actions/User/actions.js';

const Root = () => {
  const dispatch = useDispatch();
  const data = useLoaderData();

  useEffect(() => {
    dispatch(setUser(data));
  }, [dispatch, data]);

  return (
    <div className='h-[100vh] flex flex-row'>
      <div className='h-[100vh] max-[1250px]:w-[18vw] max-[1024px]:w-[8vw] w-[20vw] grid grid-rows-[1fr,6fr,0.8fr]'>
        <div className="flex flex-row items-center border-[1px] border-[#f5f5f5]">
          <div className='flex flex-row ml-[15%] items-center'>
            <img alt='logo' className="h-8 mr-1 max-[1250px]:h-7" src={logo} />
            <Title black={true} title='ChatBox' />
          </div>
        </div>
        <div className='border-[1px] border-[#f5f5f5]'>
          <Menu />
        </div>
        <div className='border-[1px] border-[#f5f5f5] flex item-center'>
          <UserCard />
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Root;

export const loader = async ({ request }) => {
  const cookie = localStorage.getItem('jwt');
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/protect`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${cookie}`
    }
  });

  const data = await response.json();
  const parsed = JSON.stringify(data.user);
  localStorage.setItem('info', parsed);

  if (data.status !== 'success') {
    return redirect('/');
  }
  return data.user;
};