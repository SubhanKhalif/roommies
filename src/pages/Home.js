import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/HomeComponents/NavBar.js';
import Description from '../components/HomeComponents/Description.js';
import Service from './Service.js';
import LoadingPage from './LoadingPage.js';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const cookie = localStorage.getItem('jwt');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/protect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookie}`
          }
        });

        const data = await response.json();
        if (data.status === 'success') {
          navigate('/home/message', { replace: true });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoading(false);
      }
    };

    checkIfLoggedIn();
  }, [navigate]);

  return (
    <div>
      {isLoading && <LoadingPage />}
      {!isLoading && (
        <>
          <div className='h-[100vh] px-40 py-5 max-[885px]:px-20 max-[653px]:px-14 bg-[#012478]'>
            <NavBar />
            <Description />
          </div>
          <Service />
        </>
      )}
    </div>
  );
};

export default Home;
