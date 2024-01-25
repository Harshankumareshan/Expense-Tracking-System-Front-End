import './App.css'
import { Home } from './components/Home';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/login';
import { Signup } from './pages/signup';
import Navbar from './components/Navbar';
import AddIncome from './pages/income/AddIncome';
import AddExpense from './pages/expense/AddExpense';
import IncomeList from './pages/income/IncomeList';
import ExpenseList from './pages/expense/ExpenseList';
import Dashboard from './pages/dashboard';
import EditIncomeForm from './pages/income/EditIncome';
import EditExpenseForm from './pages/expense/EditExpense';
function App() {


  return (
    <div className="App">
      <Navbar /> {/* Navbar outside the Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Dashboard/>} />
        <Route path="/add-income" element={<AddIncome />} />
        <Route path="/incomes" element={<IncomeList />} />
        <Route path="/edit-income/:id" element={<EditIncomeForm />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/expenses" element={<ExpenseList/>} />
        <Route path="/edit-expense/:id" element={<EditExpenseForm/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
