import { io } from 'socket.io-client';

const getSocketUrl = () => {
    return process.env.REACT_APP_SOCKET_URL;
};

export const socket = io(getSocketUrl());