import initialState from "./initial.value";

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Layoutstyle_data":
      return { ...state, layoutstyledata: action.payload };

    case "LOGIN_USER":
      return { ...state, user: action.payload.user, token: action.payload.token }; 

    case "LOGOUT_USER":
      return { ...state, user: null, token: null };

    default:
      return state;
  }
};

export default rootReducer;
