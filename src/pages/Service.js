import Card from '../components/HomeComponents/Card.js';

const Service = () => {
  return (
    <div className='h-[100vh] px-40 max-[885px]:px-20 max-[653px]:px-14 py-[5%] flex justify-center items-center'>
      <div className='flex flex-col items-center'>
        <div className='w-[60%]'>
          <div className='text-[#384055] text-6xl text-center font-semibold font-Poppins max-[1127px]:text-5xl max-[607px]:text-4xl max-[440px]:text-3xl'>
            Find Your Ideal Roommate
          </div>
        </div>
        <div className="mt-[10%] w-[70vw] max-[653px]:gap-4 grid grid-cols-1 place-items-center sm:grid-cols-2 gap-10">
          <Card 
            title='Compatibility Matching' 
            description='Our advanced algorithm matches you with roommates based on lifestyle, habits, and preferences' 
          />
          <Card 
            title='Verified Profiles' 
            description='All users go through a verification process to ensure safety and authenticity' 
          />
          <Card 
            title='Secure Messaging' 
            description='Communicate safely with potential roommates through our encrypted messaging system' 
          />
          <Card 
            title='Location-Based Search' 
            description='Find roommates in your desired area with our precise location filtering' 
          />
        </div>
      </div>
    </div>
  );
};

export default Service;
