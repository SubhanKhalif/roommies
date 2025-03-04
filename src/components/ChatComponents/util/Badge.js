import React from 'react';

const Badge = ({ children }) => {
  return (
    <div className='bg-[#FF0000] text-white text-xs h-4 w-4 flex flex-row justify-center items-center rounded-full'>
      {children}
    </div>
  );
};

export default Badge;
