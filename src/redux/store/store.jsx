import {configureStore} from "@reduxjs/toolkit";
import usersReducer from '../slices/users/userSlices'
import incomeListReducer from "../slices/income/incomeSlice";
import expenseListReducer from "../slices/expenses/expenseSlices";
const store = configureStore({
    reducer:{
        users:usersReducer,
        income:incomeListReducer,
        expense:expenseListReducer
    },
})



export default store