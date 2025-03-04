import React from 'react';

const Input = ({ text, type, placeholder, onSetData, name }) => {
  const setInput = (e) => {
    onSetData((data) => ({
      ...data,
      [name]: e.target.value
    }));
  };

  return (
    <div className='mt-3'>
      <div className='font-poppiins font-medium mb-2 text-[#BFBFBF]'>{text}</div>
      <input 
        spellCheck="false" 
        onChange={setInput}
        type={type} 
        className='outline-0 border-[1px] rounded-md w-[100%] px-2 py-2 font-poppins border-[#BFBFBF]' 
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
