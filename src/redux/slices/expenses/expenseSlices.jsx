// ... (imports remain the same)

import axios from "axios";

// Expense List ActionTypes
const FETCH_EXPENSE_LIST_REQUEST = 'expenseList/fetch/request';
const FETCH_EXPENSE_LIST_SUCCESS = 'expenseList/fetch/success';
const FETCH_EXPENSE_LIST_FAILURE = 'expenseList/fetch/failure';

const POST_EXPENSE_REQUEST = 'expense/post/request';
const POST_EXPENSE_SUCCESS = 'expense/post/success';
const POST_EXPENSE_FAILURE = 'expense/post/failure';

const EDIT_EXPENSE_REQUEST = 'expense/edit/request';
const EDIT_EXPENSE_SUCCESS = 'expense/edit/success';
const EDIT_EXPENSE_FAILURE = 'expense/edit/failure';

// Expense List Actions
export const fetchExpenseListRequest = () => ({ type: FETCH_EXPENSE_LIST_REQUEST });
export const fetchExpenseListSuccess = (payload) => ({ type: FETCH_EXPENSE_LIST_SUCCESS, payload });
export const fetchExpenseListFailure = (error) => ({ type: FETCH_EXPENSE_LIST_FAILURE, error });

// Add expense
export const postExpenseRequest = () => ({ type: POST_EXPENSE_REQUEST });
export const postExpenseSuccess = (payload) => ({ type: POST_EXPENSE_SUCCESS, payload });
export const postExpenseFailure = (error) => ({ type: POST_EXPENSE_FAILURE, error });

// Edit expense
export const editExpenseRequest = () => ({ type: EDIT_EXPENSE_REQUEST });
export const editExpenseSuccess = (payload) => ({ type: EDIT_EXPENSE_SUCCESS, payload });
export const editExpenseFailure = (error) => ({ type: EDIT_EXPENSE_FAILURE, error });

// Async Action to Fetch Expense List
export const fetchExpenseList = () => {
  return async (dispatch, getState) => {
    dispatch(fetchExpenseListRequest());

    try {
      const token = getState().user.token || '';
      const response = await axios.get('https://expensetracker-5772.onrender.com/expense/get-expense', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchExpenseListSuccess(response.data));
    } catch (error) {
      if (!error.response) {
        dispatch(fetchExpenseListFailure({ error: { message: "Some error", token: getState().user.token || '' } }));
      } else {
        dispatch(fetchExpenseListFailure(error.response.data));
      }
    }
  };
};

export const postExpense = (expenseData) => {
  return async (dispatch, getState) => {
    dispatch(postExpenseRequest());

    try {
      const userInfoString = localStorage.getItem('userInfo');
      const token = userInfoString ? JSON.parse(userInfoString).token : null;
      const response = await axios.post('https://expensetracker-5772.onrender.com/expense/add-expense', expenseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(postExpenseSuccess(response.data));
    } catch (error) {
      if (!error.response) {
        dispatch(postExpenseFailure(error));
      } else {
        dispatch(postExpenseFailure(error.response.data));
      }
    }
  };
};

export const editExpense = (editedExpenseData) => {
  return async (dispatch, getState) => {
    dispatch(editExpenseRequest());

    try {
      const token = getState().user.token || '';
      const response = await axios.put('https://expensetracker-5772.onrender.com/expense/edit-expense', editedExpenseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(editExpenseSuccess(response.data));
    } catch (error) {
      if (!error.response) {
        dispatch(editExpenseFailure(error));
      } else {
        dispatch(editExpenseFailure(error.response.data));
      }
    }
  };
};

// Reducer
const initialState = {
  expenseList: [],
  loading: false,
  error: undefined,
  posting: false,
  postError: undefined,
  editing: false,
  editError: undefined,
};

const expenseListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EXPENSE_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case FETCH_EXPENSE_LIST_SUCCESS:
      return {
        ...state,
        expenseList: action.payload.expense,
        loading: false,
        error: undefined,
      };
    case FETCH_EXPENSE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error?.message,
      };
    case POST_EXPENSE_REQUEST:
      return {
        ...state,
        posting: true,
        postError: undefined,
      };
    case POST_EXPENSE_SUCCESS:
      return {
        ...state,
        posting: false,
        postError: undefined,
        expenseList: [...state.expenseList, action.payload],
      };
    case POST_EXPENSE_FAILURE:
      return {
        ...state,
        posting: false,
        postError: action.error?.message,
      };
    case EDIT_EXPENSE_REQUEST:
      return {
        ...state,
        editing: true,
        editError: undefined,
      };
    case EDIT_EXPENSE_SUCCESS:
      const editedExpenseIndex = state.expenseList.findIndex(expense => expense.id === action.payload.id);
      const updatedExpenseList = [...state.expenseList];
      updatedExpenseList[editedExpenseIndex] = action.payload;

      return {
        ...state,
        editing: false,
        editError: undefined,
        expenseList: updatedExpenseList,
      };
    case EDIT_EXPENSE_FAILURE:
      return {
        ...state,
        editing: false,
        editError: action.error?.message,
      };
    default:
      return state;
  }
};

export default expenseListReducer;
    