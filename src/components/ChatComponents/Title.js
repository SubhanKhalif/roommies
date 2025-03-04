import React from 'react';

const Title = ({ title, black }) => {
  if (black) {
    return (
      <div className="max-[1250px]:text-2xl max-[1024px]:hidden font-serif tracking-tighter text-3xl font-bold text-black">
        matefinder
      </div>
    );
  }

  return (
    <div className="max-[1250px]:text-2xl font-serif tracking-tighter text-3xl font-bold text-[#0538FF]">
      {title}
    </div>
  );
};

export default Title;
