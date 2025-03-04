import React from 'react';
import Item from './Item.js';

const Menu = () => {
  const menuItems = [
    { val: 1, to: 'search', text: 'Search' },
    { val: 4, to: 'landing', text: 'Find Roommate' },
    { val: 5, to: 'create-post', text: 'Create Post' },
    { val: 0, to: 'message', text: 'Messages' },
    { val: 3, to: 'settings', text: 'Settings' },
    { val: 2, to: 'dashboard', text: 'About' },
  ];

  return (
    <div className='flex flex-col items-center'>
      <div className='w-[80%]'>
        {menuItems.map((item) => (
          <Item key={item.val} val={item.val} to={item.to} text={item.text} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
