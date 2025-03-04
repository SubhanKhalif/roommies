import { Skeleton } from '@mui/material';

const Loading = () => {
  return (
    <div className='w-[100%] border-[#acacac] flex flex-col'>
      <Skeleton height={70} />
      <Skeleton height={70} />
    </div>
  );
};

export default Loading;
