const initialState = {
  userInfo: null
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_USER':
      return {
        ...state,
        userInfo: payload
      };
    
    default:
      return state;
  }
};

export default userReducer;