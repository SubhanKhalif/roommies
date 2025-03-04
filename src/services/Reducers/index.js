import { combineReducers } from 'redux';
import userReducer from './userReducer.js';
import chatReducer from './chatReducer.js';

export const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer
});

export default rootReducer;