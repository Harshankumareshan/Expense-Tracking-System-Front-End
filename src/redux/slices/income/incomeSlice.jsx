import axios from 'axios';

// Income List ActionTypes
const FETCH_INCOME_LIST_REQUEST = 'incomeList/fetch/request';
const FETCH_INCOME_LIST_SUCCESS = 'incomeList/fetch/success';
const FETCH_INCOME_LIST_FAILURE = 'incomeList/fetch/failure';

const POST_INCOME_REQUEST = 'income/post/request';
const POST_INCOME_SUCCESS = 'income/post/success';
const POST_INCOME_FAILURE = 'income/post/failure';

const EDIT_INCOME_REQUEST = 'income/edit/request';
const EDIT_INCOME_SUCCESS = 'income/edit/success';
const EDIT_INCOME_FAILURE = 'income/edit/failure';

// Income List Actions
export const fetchIncomeListRequest = () => ({ type: FETCH_INCOME_LIST_REQUEST });
export const fetchIncomeListSuccess = (payload) => ({ type: FETCH_INCOME_LIST_SUCCESS, payload });
export const fetchIncomeListFailure = (error) => ({ type: FETCH_INCOME_LIST_FAILURE, error });

// Add income
export const postIncomeRequest = () => ({ type: POST_INCOME_REQUEST });
export const postIncomeSuccess = (payload) => ({ type: POST_INCOME_SUCCESS, payload });
export const postIncomeFailure = (error) => ({ type: POST_INCOME_FAILURE, error });

// Edit income
export const editIncomeRequest = () => ({ type: EDIT_INCOME_REQUEST });
export const editIncomeSuccess = (payload) => ({ type: EDIT_INCOME_SUCCESS, payload });
export const editIncomeFailure = (error) => ({ type: EDIT_INCOME_FAILURE, error });

// Async Action to Fetch Income List
export const fetchIncomeList = () => {
  return async (dispatch, getState) => {
    console.log('Current State:', getState());
    dispatch(fetchIncomeListRequest());

    try {
      const token = getState().user.token || '';
      const response = await axios.get('https://expensetracker-5772.onrender.com/income/get-incomes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchIncomeListSuccess(response.data));
    } catch (error) {
      if (!error.response) {
        // If there's no error response, dispatch with a generic error message
        dispatch(fetchIncomeListFailure({ error: { message: "Some error", token: getState().user.token || '' } }));
      } else {
        // If there's an error response, dispatch with the response data
        dispatch(fetchIncomeListFailure(error.response.data));
      }
    }
  };
};

  
  
  export const postIncome = (incomeData) => {
    return async (dispatch, getState) => {
      dispatch(postIncomeRequest());
  
      try {
        const userInfoString = localStorage.getItem('userInfo');
        const token = userInfoString ? JSON.parse(userInfoString).token : null;
        console.log(token)
        const response = await axios.post('https://expensetracker-5772.onrender.com/income/add-income', incomeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(postIncomeSuccess(response.data));
      } catch (error) {
        if (!error.response) {
          dispatch(postIncomeFailure(error));
        } else {
          dispatch(postIncomeFailure(error.response.data));
        }
      }
    };
  };
  
  export const editIncome = (editedIncomeData) => {
    return async (dispatch, getState) => {
      dispatch(editIncomeRequest());
  
      try {
        const token = getState().user.token || '';
        const response = await axios.put('https://expensetracker-5772.onrender.com/income/edit-income', editedIncomeData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(editIncomeSuccess(response.data));
      } catch (error) {
        if (!error.response) {
          dispatch(editIncomeFailure(error));
        } else {
          dispatch(editIncomeFailure(error.response.data));
        }
      }
    };
  };
// Reducer
const initialState = {
    incomeList: [],
    loading: false,
    error: undefined,
  
    // Add new properties for posting income
    posting: false,
    postError: undefined,
  
    // Add new properties for editing income
    editing: false,
    editError: undefined,
  };

const incomeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INCOME_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case FETCH_INCOME_LIST_SUCCESS:
      return {
        ...state,
        incomeList: action.payload.income,
        loading: false,
        error: undefined,
      };
    case FETCH_INCOME_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error?.message,
      };
    case POST_INCOME_REQUEST:
      return {
        ...state,
        posting: true,
        postError: undefined,
      };
    case POST_INCOME_SUCCESS:
      return {
        ...state,
        posting: false,
        postError: undefined,
        incomeList: [...state.incomeList, action.payload],
      };
    case POST_INCOME_FAILURE:
      return {
        ...state,
        posting: false,
        postError: action.error?.message,
      };
    case EDIT_INCOME_REQUEST:
      return {
        ...state,
        editing: true,
        editError: undefined,
      };
    case EDIT_INCOME_SUCCESS:
      // Update the incomeList with the edited data
      const editedIncomeIndex = state.incomeList.findIndex(income => income.id === action.payload.id);
      const updatedIncomeList = [...state.incomeList];
      updatedIncomeList[editedIncomeIndex] = action.payload;

      return {
        ...state,
        editing: false,
        editError: undefined,
        incomeList: updatedIncomeList,
      };
    case EDIT_INCOME_FAILURE:
      return {
        ...state,
        editing: false,
        editError: action.error?.message,
      };
    default:
      return state;
  }
};

export default incomeListReducer;