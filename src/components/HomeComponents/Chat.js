import { MotionAnimate } from 'react-motion-animate';

const Chat = ({ message, isMale }) => {
  const maleStyles = 'bg-[#FFAF3A] max-[1500px]:text-sm max-[528px]:text-xs rounded-t-[20px] rounded-br-[20px] px-[5%] py-[4%] my-[5%] text-black font-Roboto font-bold';
  const femaleStyles = 'bg-[#FFFFFF] max-[1500px]:text-sm max-[528px]:text-xs rounded-t-[20px] rounded-bl-[20px] px-[5%] py-[4%] my-[5%] text-black font-Roboto font-bold';

  return (
    <MotionAnimate animation="fadeInUp">
      <div className={isMale ? maleStyles : femaleStyles}>
        {message}
      </div>
    </MotionAnimate>
  );
};

export default Chat;
