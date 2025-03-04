import React from 'react';
import Logo from '../../assets/images/logo-large.png';
import NavList from './NavList.js';

const NavBar = () => {
  return (
    <div className='flex justify-between'>
      <div className='text-white flex flex-row items-center'>
        <img src={Logo} alt='logo' className='w-10' />
        <div className='text-white text-2xl font-Roboto font-semibold ml-2'>
          MateFinder
        </div>
      </div>
      <NavList />
    </div>
  );
};

export default NavBar;
