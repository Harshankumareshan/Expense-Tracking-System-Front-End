import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Dashboard from "../dashboard";

const ExpenseList = () => {
  const [timePeriod, setTimePeriod] = useState("all");
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userInfoString = localStorage.getItem("userInfo");
  console.log(userInfoString);
  const userId = userInfoString ? JSON.parse(userInfoString).userId : null;
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  useEffect(() => {
    const fetchExpenseList = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://expensetracker-5772.onrender.com/expense/get-expense?timePeriod=${timePeriod}&page=${currentPage}&userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setExpenseList(response.data.docs);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExpenseList();
  }, [timePeriod, currentPage, userId, token]);

  const handleDownloadReport = async () => {
    try {
      const table = document.querySelector("table");
      const canvas = await html2canvas(table);

      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");

      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("ExpenseList.pdf");

      toast.success(`Downloading report...`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("Error generating PDF:", error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  console.log(expenseList)

  
  const handleDeleteExpense = async (incomeId) => {
    try {
      const response = await axios.delete(
        `https://expensetracker-5772.onrender.com/expense/delete-expense/${incomeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        // Remove the deleted income from the state
        setExpenseList((prevIncomeList) =>
          prevIncomeList.filter((income) => income._id !== incomeId)
        );

        toast.success(`Expense deleted successfully.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(`Error deleting expense. Please try again.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Error deleting expense:", error.message);
      toast.error(`Error deleting expense. Please try again.`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Expense List</h1>
      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          Select Time Period
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setTimePeriod("all")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => setTimePeriod("2months")}>
            Last 2 Months
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setTimePeriod("yearly")}>Yearly</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="mb-3">
        <Button variant="primary" onClick={handleDownloadReport}>
          Download Report
        </Button>
      </div>
      <ToastContainer />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenseList.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.date}</td>
              <td>
                <Link to={`/edit-expense/${expense.id}`}>
                  <Button variant="primary">Edit</Button>
                </Link>
              </td>
              <td>
              <Button
                  variant="danger"
                  onClick={() => handleDeleteExpense(expense._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <Button
          variant="outline-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous Page
        </Button>
        <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          variant="outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next Page
        </Button>
      </div>
      {/* <Dashboard expenseList={expenseList} /> */}
    </div>
  );
};

export default ExpenseList;