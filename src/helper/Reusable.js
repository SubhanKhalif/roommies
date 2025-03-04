 export const getSender = (users) => {
    const loggedUser = JSON.parse(localStorage.getItem('info'));
    return users[0]._id === loggedUser._id ? users[1] : users[0];
 };

 export const getUsersLeavingMe = (users) => {
   const loggedUser = JSON.parse(localStorage.getItem('info'));
   return users.filter(({ _id }) => _id !== loggedUser._id);
 };

 export const isSender = (id) => {
  const loggedUser = JSON.parse(localStorage.getItem('info'));
  return loggedUser._id === id;
 };

 export const isSameUser = (messages, index) => {
  return index !== 0 && messages[index].sender._id === messages[index - 1].sender._id;
 };