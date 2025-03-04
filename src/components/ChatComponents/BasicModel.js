import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Modal } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import GroupUserList from './GroupUserList.js';
import User from './User.js';
import Loading from './Loading.js';
import { AddGroup } from '../../services/Actions/Chat/action.js';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: window.innerWidth / 3,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '14px',
  p: 4,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  outline: 'none',
};

const BasicModal = ({ handleClose, open }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isEmptyResults, setIsEmptyResults] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const groupNameRef = useRef();
  const dispatch = useDispatch();

  const notify = (type, message) => {
    const toastConfig = {
      position: 'top-right',
      autoClose: 2222,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    };

    return type === 'error' 
      ? toast.error(message, toastConfig)
      : toast.info('Successfully group created', toastConfig);
  };

  const searchUsers = async (query) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/users?search=${query}`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { users } = await response.json();
      const limitedResults = users.slice(0, 2);
      
      setIsEmptyResults(limitedResults.length === 0);
      setSearchResults(limitedResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e) => {
    const query = e.target.value;
    setTimeout(() => searchUsers(query), 2000);
  };

  const addUser = (user) => {
    setSelectedUsers((currentUsers) => {
      const isDuplicate = currentUsers.some((u) => u._id === user._id);
      if (isDuplicate) {
        notify('error', 'User already in the group!');
        return currentUsers;
      }
      return [...currentUsers, user];
    });
  };

  const removeUser = (userId) => {
    setSelectedUsers((currentUsers) => 
      currentUsers.filter((user) => user._id !== userId)
    );
  };

  const createGroup = async () => {
    if (isCreatingGroup) return;
    
    setIsCreatingGroup(true);
    try {
      const groupName = groupNameRef.current.value;
      const userIds = selectedUsers.map((user) => user._id);

      if (!groupName) {
        notify('error', 'Please specify the group name!');
        return;
      }
      if (selectedUsers.length < 2) {
        notify('error', 'Should add at least 2 people!');
        return;
      }

      const token = localStorage.getItem('jwt');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/chat/group`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: groupName,
            users: JSON.stringify(userIds),
          }),
        }
      );

      const { status, fgroupChat } = await response.json();
      if (status === 'success') {
        notify();
        dispatch(AddGroup(fgroupChat));
        setSearchResults([]);
        setSelectedUsers([]);
        handleClose();
      }
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <div className="absolute">
      <ToastContainer />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="text-2xl font-Poppins">Create a group Chat</div>
          <input
            ref={groupNameRef}
            spellCheck="false"
            placeholder="Chat Name"
            className="text-lg h-[16%] w-[100%] mt-5 font-thin px-1 py-2 outline-none bg-[#F6F8FC]"
          />
          <input
            onChange={handleInput}
            spellCheck="false"
            placeholder="Add your Friends"
            className="text-lg h-[16%] w-[100%] px-1 py-2 mt-3 outline-none font-thin bg-[#F6F8FC]"
          />
          <div className="w-[100%]">
            {!isLoading && searchResults.length > 0 && searchResults.map((user) => (
              <User key={user._id} add={addUser} values={user} />
            ))}
            {!isLoading && isEmptyResults && <p>No results found</p>}
            {isLoading && <Loading />}
          </div>
          {selectedUsers.length > 0 && (
            <GroupUserList remove={removeUser} users={selectedUsers} />
          )}
          <div>
            <button
              onClick={createGroup}
              className="bg-[#0147FF] text-white text-xl px-4 py-2 mt-4 rounded-lg"
            >
              Create Chat
            </button>
            <button
              onClick={() => {
                setSearchResults([]);
                setSelectedUsers([]);
                handleClose();
              }}
              className="text-[#0147FF] text-xl border-[2px] border-[#0147FF] px-4 py-1.5 ml-2 mt-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
