import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SpeechRecognition from 'react-speech-recognition';
import { socket } from '../../socket/socket.js';
import { Mic as MicIcon, Send as SendIcon, Cancel as CancelIcon, InsertEmoticon as InsertEmoticonIcon } from '@mui/icons-material';
import { AddMessage, moveChatToTop, updateChatBar } from '../../services/Actions/Chat/action.js';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Box, IconButton, createTheme, ThemeProvider } from '@mui/material';
import onMicSoundFile from '../../assets/sounds/onMic.mp3';
import offMicSoundFile from '../../assets/sounds/offMic.mp3';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const Type = () => {
  const isSet = useSelector((state) => state.chat.activeChat);
  const AllChats = useSelector((state) => state.chat.AllChats);
  const [message, setMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [Microphone, setMicrophone] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [noSoundTimeout, setNoSoundTimeout] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  const commands = [
    {
      command: '*',
      callback: (command) => {
        setMessage(prev => prev + ' ' + command);
      }
    }
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = SpeechRecognition.useSpeechRecognition({ commands });

  useEffect(() => {
    setMessage(transcript);
    resetNoSoundTimeout();
  }, [transcript]);

  useEffect(() => {
    if (!isSet) return;
    resetTranscript();
    if (listening) {
      SpeechRecognition.stopListening();
    }
    setMicrophone(false);
    setMessage('');
  }, [isSet, listening]);

  useEffect(() => {
    if (!isSet) return;

    const loggedUser = JSON.parse(localStorage.getItem('info'));
    socket.emit('setup', loggedUser);
    socket.on('connected', () => setSocketConnected(true));
    socket.emit('join chat', isSet._id);
  }, [isSet]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setOpenPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetNoSoundTimeout = () => {
    if (noSoundTimeout) clearTimeout(noSoundTimeout);
    setNoSoundTimeout(setTimeout(() => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
      setMicrophone(false);
    }, 5000));
  };

  const messageHandler = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', isSet._id);
    }
    setTimeout(() => {
      if (typing) {
        socket.emit('stop typing', isSet._id);
        setTyping(false);
      }
    }, 3000);
  };

  const sendMessage = async (event) => {
    if (!message.trim()) return;
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      const token = localStorage.getItem('jwt');
      const bodyData = { chatId: isSet._id, content: message };
      setMessage('');
      resetTranscript();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      dispatch(AddMessage(data.data));
      dispatch(updateChatBar(isSet._id, data.data.content));
      if (AllChats[0]._id !== isSet._id) dispatch(moveChatToTop(isSet._id));
      socket.emit('new message', data.data);
    }
  };

  const toggleMic = async () => {
    if (Microphone) {
      if (listening) {
        await SpeechRecognition.stopListening();
      }
      setMicrophone(false);
      if (hasMounted) new Audio(offMicSoundFile).play();
      if (noSoundTimeout) clearTimeout(noSoundTimeout);
    } else {
      if (!browserSupportsSpeechRecognition) {
        alert('Browser does not support speech recognition.');
        return;
      }
      try {
        await SpeechRecognition.startListening({ continuous: true });
        setMicrophone(true);
        if (hasMounted) new Audio(onMicSoundFile).play();
        resetNoSoundTimeout();
      } catch (error) {
        alert('Failed to start speech recognition. Please make sure microphone access is allowed.');
      }
    }
  };

  const handleEmojiClick = (emoji) => setMessage((prev) => prev + emoji.native);

  if (!isSet) return null;

  return (
    <ThemeProvider theme={theme}>
      <div className="border border-gray-300 bg-white h-[12%] flex justify-center items-center relative" ref={emojiPickerRef}>
        <IconButton onClick={toggleMic} sx={{ position: 'absolute', left: '7%' }}>
          {Microphone ? <CancelIcon color="info" /> : <MicIcon color="info" />}
        </IconButton>
        <Box sx={{ zIndex: 10, left: '47%', position: 'fixed', bottom: 81, display: openPicker ? 'inline' : 'none' }}>
          <Picker theme={theme.palette.mode} data={data} onEmojiSelect={handleEmojiClick} />
        </Box>
        <IconButton onClick={() => setOpenPicker(!openPicker)}>
          <InsertEmoticonIcon />
        </IconButton>
        <IconButton onClick={sendMessage} sx={{ position: 'absolute', right: '5%' }}>
          <SendIcon color="action" />
        </IconButton>
        <textarea
          ref={inputRef}
          value={message}
          onKeyDown={sendMessage}
          onChange={messageHandler}
          spellCheck={false}
          placeholder="Type a message"
          className="bg-gray-100 resize-none text-md w-[95%] py-2 outline-none h-[70%] rounded-3xl px-4"
        />
      </div>
    </ThemeProvider>
  );
};

export default Type;
