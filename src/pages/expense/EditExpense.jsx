import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditExpenseForm = () => {
  const { id } = useParams(); // Get the expense ID from the URL params
  const navigate = useNavigate();

  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  const userInfoString = localStorage.getItem("userInfo");
  const userId = userInfoString ? JSON.parse(userInfoString).userId : null;
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  useEffect(() => {
    // Fetch expense data based on the ID when the component mounts
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker-5772.onrender.com/expense/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExpenseData(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching expense data:", error.message);
      }
    };

    fetchExpenseData();
  }, [id]);

  const handleInputChange = (e) => {
    setExpenseData({
      ...expenseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateExpense = async () => {
    try {
      // Make a PUT request to update the expense data
      await axios.put(
        `https://expensetracker-5772.onrender.com/expense/${id}`,
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Redirect to the expense list page after successful update
      navigate("/expenses");
    } catch (error) {
      console.error("Error updating expense:", error.message);
    }
  };

  return (
    <div>
      <h1>Edit Expense</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={expenseData.title}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            name="amount"
            value={expenseData.amount}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category"
            name="category"
            value={expenseData.category}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            name="description"
            value={expenseData.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={expenseData.date}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdateExpense}>
          Update Expense
        </Button>
      </Form>
    </div>
  );
};

export default EditExpenseForm;