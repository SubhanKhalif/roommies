import { useState } from 'react';
import SearchBar from '../components/SearchComponents/SearchBar.js';
import Loading from '../components/SearchComponents/Loading.js';
import User from '../components/SearchComponents/User.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddUser } from '../services/Actions/Chat/action.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.chat.AllChats);

  const notify = (value) => toast.info(`Added ${value}`, {
    position: "bottom-center",
    autoClose: 2222,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [resultsEmpty, setResultsEmpty] = useState(false);

  const onChangeTextHandler = (e) => {
    if (!e.target.value) {
      setUsers([]);
      setResultsEmpty(false);
      return;
    }

    const timeout = setTimeout(() => {
      searchHandler(e.target.value);
    }, 1000);

    return () => clearTimeout(timeout);
  };

  const searchHandler = async (value) => {
    setIsLoading(true);
    const cookie = localStorage.getItem("jwt");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users?search=${value}`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${cookie}`,
        },
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging Log

      if (data.status === "success" && data.data && Array.isArray(data.data.users)) {
        const limitedUsers = (data.data.users || []).slice(0, 2);
        setUsers(limitedUsers);
        setResultsEmpty(limitedUsers.length === 0);
      } else {
        console.error("Unexpected response format:", data);
        setUsers([]);
        setResultsEmpty(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setUsers([]);
      setResultsEmpty(true);
    } finally {
      setIsLoading(false);
    }
  };

  const accessChatHandler = (values) => {
    const isPresent = state.find((data) => data.email === values.email);
    dispatch(AddUser(values, state));
    notify(values.name);
    setTimeout(() => {
      navigate('/home/message', { replace: true });
    }, 2000);
  };

  return (
    <div className='w-[80vw] relative flex flex-col'>
      <ToastContainer />
      <SearchBar onChange={onChangeTextHandler} searchHandler={searchHandler} />
      <div className='w-[100%] flex box-border justify-center py-2 relative'>
        {!isLoading && resultsEmpty && <p>0 matching results found</p>}
        {isLoading && <Loading />}
        {!isLoading && users.length > 0 && (
          <div className='w-[60%] border-[1px] rounded-md border-[#acacac] px-[1%] py-[1%] flex flex-col'>
            {users.map((data, index) => (
              <User accessChat={accessChatHandler} values={data} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
