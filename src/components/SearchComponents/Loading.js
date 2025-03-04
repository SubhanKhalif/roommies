import React from 'react';
import { Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <div className='w-[60%] border-[#acacac] flex flex-col'>
      <Skeleton height={75} />
      <Skeleton height={75} />
      <Skeleton height={75} />
    </div>
  );
};

export default Loading;
