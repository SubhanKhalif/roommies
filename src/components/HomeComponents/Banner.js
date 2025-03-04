import React from 'react';
import roommate from '../../assets/images/microsoft.svg';

const Banner = () => {
  return (
    <a href='#' className="cursor-pointer max-[1127px]:hidden">
      <div className='flex flex-row bg-white border-[0.2px] border-[#CFCFCF] rounded-md px-2 py-1 mt-6 shadow-md'>
        <img className='w-16' src={roommate} alt="Fine Roommate" />
        <div className='flex flex-col text-black justify-center font-Roboto ml-2'>
          <div className='text-[10px] font-light'>Find your perfect</div>
          <div className='text-xl font-bold'>Roommate</div>
        </div>
      </div>
    </a>
  );
};

export default Banner;
