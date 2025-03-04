import { CheckCircle } from '@mui/icons-material';

const Card = ({ title, description }) => {
  return (
    <div className='flex flex-row gap-2 w-[80%]'>
      <div className='mt-1'>
        <CheckCircle style={{ color: '#56D12C', fontSize: 22 }} />
      </div>
      <div>
        <div className="font-Roboto font-semibold text-lg sm:text-xl">{title}</div>
        <div className='mt-[2%] font-Roboto text-base sm:text-lg'>{description}</div>
      </div>
    </div>
  );
};

export default Card;
