import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const user = useSelector((state) => state.users.users);

  const userInfoString = localStorage.getItem('userInfo');
  const userId = userInfoString ? JSON.parse(userInfoString).userId : null;
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  // Add state to track whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    if (userId && token) {
      setIsLoggedIn(true);
      
      const fetchIncomeList = async () => {
        try {
          const response = await axios.get(
            `https://expensetracker-5772.onrender.com/income/get-incomes?page=1&userId=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setIncomeList(response.data.docs);
        } catch (error) {
          console.error('Error fetching income data:', error.message);
        }
      };

      const fetchExpenseList = async () => {
        try {
          const response = await axios.get(
            `https://expensetracker-5772.onrender.com/expense/get-expense?page=1&userId=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setExpenseList(response.data.docs);
        } catch (error) {
          console.error('Error fetching expense data:', error.message);
        }
      };

      fetchIncomeList();
      fetchExpenseList();
    } else {
      setIsLoggedIn(false);
    }
  }, [userId, token]);

  useEffect(() => {
    if (incomeList && incomeList.length > 0) {
      const incomeTotal = incomeList.reduce((total, item) => total + item.amount, 0);
      setTotalIncome(incomeTotal);
    }

    if (expenseList && expenseList.length > 0) {
      const expenseTotal = expenseList.reduce((total, item) => total + item.amount, 0);
      setTotalExpense(expenseTotal);
    }
  }, [incomeList, expenseList]);

  useEffect(() => {
    setRemainingAmount(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  // Prepare data for the chart
  const chartData = {
    labels: ['Total Income', 'Total Expense', 'Remaining Amount'],
    datasets: [
      {
        label: 'Financial Overview',
        backgroundColor: ['green', 'red', 'blue'],
        data: [totalIncome, totalExpense, remainingAmount],
        barThickness: 70,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      {isLoggedIn ? (
        <>
          <Row className="mt-3">
            <Col>
              <h1>Welcome, {user.username}</h1>
              <p>Email: {user.email}</p>
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <Bar data={chartData} options={chartOptions}  height={120} width={300} />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title><h2>Financial Overview</h2></Card.Title>
                  <Card.Text>
                    <p style={{ color: 'green' }}>Total Income: ${totalIncome}</p>
                    <p style={{ color: 'red' }}>Total Expense: ${totalExpense}</p>
                    <h3 style={{ color: 'blue' }}>Remaining Amount: ${remainingAmount}</h3>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Row className="mt-5">
          <Col>
            <h1>"login to access the dashboard"</h1>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;