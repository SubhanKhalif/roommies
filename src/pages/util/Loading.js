import { Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <div className='w-[100%] border-[#acacac] flex flex-col items-center'>
      {Array(5).fill().map((_, index) => (
        <Skeleton key={index} className='w-[90%]' height={85} />
      ))}
    </div>
  );
};

export default Loading;
