// Import necessary libraries
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditIncomeForm = () => {
  const { id } = useParams(); // Get the income ID from the URL params
 const navigate = useNavigate()

  const [incomeData, setIncomeData] = useState({
    title: "",
    amount: 0,
    category: "",
    description: "",
    date: "",
  });

  
  const userInfoString = localStorage.getItem("userInfo");
  console.log(userInfoString);
  const userId = userInfoString ? JSON.parse(userInfoString).userId : null;
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  useEffect(() => {
    // Fetch income data based on the ID when the component mounts
    const fetchIncomeData = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker-5772.onrender.com/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        
        );
        setIncomeData(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching income data:", error.message);
      }
    };

    fetchIncomeData();
  }, [id]);

  const handleInputChange = (e) => {
    setIncomeData({
      ...incomeData,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdateIncome = async () => {
    try {
      // Make a PUT request to update the income data
      await axios.put(
        `https://expensetracker-5772.onrender.com/income/${id}`,
        incomeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Redirect to the income list page after successful update
      navigate("/incomes");
    } catch (error) {
      console.error("Error updating income:", error.message);
    }
  };
  

  return (
    <div>
      <h1>Edit Income</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={incomeData.title}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            name="amount"
            value={incomeData.amount}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category"
            name="category"
            value={incomeData.category}
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
            value={incomeData.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={incomeData.date}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdateIncome}>
          Update Income
        </Button>
      </Form>
    </div>
  );
};

export default EditIncomeForm;