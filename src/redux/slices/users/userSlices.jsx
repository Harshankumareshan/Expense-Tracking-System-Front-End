import axios from 'axios'

// Login ActionTypes
const LOGIN_REQUEST = "user/login/request";
const LOGIN_SUCCESS = "user/login/success";
const LOGIN_FAILURE = "user/login/failure";

//Register Action

const SIGNUP_REQUEST = "user/register/request";
const SIGNUP_SUCCESS = "user/register/success";
const SIGNUP_FAILURE = "user/register/failure";

// Logout Action
const LOGOUT_REQUEST = "user/logout/request";
const LOGOUT_SUCCESS = "user/logout/success";
const LOGOUT_FAILURE = "user/logout/failure";

// Login Actions
export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (payload) => ({ type: LOGIN_SUCCESS, payload });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, error });

//Sign up Actions
export const signupRequest = () => ({ type: SIGNUP_REQUEST });
export const signupSuccess = (payload) => ({ type: SIGNUP_SUCCESS, payload });
export const signupFailure = (error) => ({ type: SIGNUP_FAILURE, error });

//Logout Actions
export const logoutRequest = () => ({ type: LOGOUT_REQUEST });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });
export const logoutFailure = (error) => ({ type: LOGOUT_FAILURE, error });


//Signup
export const signupUser = (payload) => {
    return async (dispatch) => {
      dispatch(signupRequest());
    
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    
      try {
        const response = await axios.post(
          "https://expensetracker-5772.onrender.com/register",
          payload,
          config
        );
        dispatch(signupSuccess(response.data));
        localStorage.setItem('userInfo', JSON.stringify(response.data.session));
      } catch (error) {
        if (!error.response) {
          dispatch(signupFailure(error));
        } else {
          dispatch(signupFailure(error.response.data));
        }
      }
    };
  };
  



//Login
export const loginUser = (payload) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(
        "https://expensetracker-5772.onrender.com/login",
        payload,
        config
      );
      dispatch(loginSuccess(response.data));
       console.log(response.data.session);
      localStorage.setItem('userInfo', JSON.stringify(response.data.session));
    } catch (error) {
      if (!error.response) {
        dispatch(loginFailure(error));
      } else {
        dispatch(loginFailure(error.response.data));
      }
    }
  };
};

//Logout

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(logoutRequest());

    try {

      // Clear user session from local storage
      localStorage.removeItem("userInfo");

      // Dispatch logout success action
      dispatch(logoutSuccess());
    } catch (error) {
      dispatch(logoutFailure(error));
    }
  };
};






//Get user from local storage and place it inside our store

const userLoginFormStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) :undefined

// Reducer

const initialState = {
  auth: false,
  users:userLoginFormStorage,
  userLoading: false,
  userAppErr: undefined,
  userServerErr: undefined,
};




const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        userLoading: true,
        userAppErr: undefined,
        userServerErr: undefined,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        auth: action.payload.user,
        users: action.payload.user,
        userLoading: false,
        userAppErr: undefined,
        userServerErr: undefined,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        userLoading: false,
        userAppErr: action.error?.message,
        userServerErr: action.error?.message,
      };
      case SIGNUP_REQUEST:
      return {
        ...state,
        ...state,
        userLoading: true,
        userAppErr: undefined,
        userServerErr: undefined,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        auth: action.payload.userData,
        users: action.payload.userData,
        userLoading: false,
        userAppErr: undefined,
        userServerErr: undefined,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        userLoading: false,
        userAppErr: action.error?.message,
        userServerErr: action.error?.message,
      };
      case LOGOUT_REQUEST:
      return {
        ...state,
        userLoading: true,
        userAppErr: undefined,
        userServerErr: undefined,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        auth: false,
        users: null,
        userLoading: false,
        userAppErr: undefined,
        userServerErr: undefined,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        userLoading: false,
        userAppErr: action.error?.message,
        userServerErr: action.error?.message,
      };
    default:
      return state;
  }
};

export default usersReducer;