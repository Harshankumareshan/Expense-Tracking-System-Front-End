import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { postExpense } from '../../redux/slices/expenses/expenseSlices';


const AddExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: '',
    user: '', // You may need to set the user ID dynamically
  });

  const [touched, setTouched] = useState({
    title: false,
    amount: false,
    category: false,
    description: false,
    date: false,
    user: false,
  });

  const [errors, setErrors] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: '',
    user: '',
  });

  const userInfoString = localStorage.getItem('userInfo');
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name);
  };

  const validateField = (fieldName) => {
    switch (fieldName) {
      case 'title':
        setErrors({
          ...errors,
          title: formData.title ? '' : 'Title is required',
        });
        break;
      case 'amount':
        setErrors({
          ...errors,
          amount: formData.amount ? '' : 'Amount is required',
        });
        break;
      case 'category':
        setErrors({
          ...errors,
          category: formData.category ? '' : 'Category is required',
        });
        break;
      case 'description':
        setErrors({
          ...errors,
          description: formData.description ? '' : 'Description is required',
        });
        break;
      case 'date':
        setErrors({
          ...errors,
          date: formData.date ? '' : 'Date is required',
        });
        break;
      case 'user':
        setErrors({
          ...errors,
          user: formData.user ? '' : 'User is required',
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields on submission
    Object.keys(formData).forEach((fieldName) => {
      validateField(fieldName);
    });

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error);

    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);

      // Include the user ID in the formData
      const updatedFormData = { ...formData, user: userInfo.userId }; 

      // Dispatch addIncome action
      dispatch(postExpense(updatedFormData, userInfo.token));

      // Reset the form data
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: '',
        user: '', // Resetting the user field
      });

      // Show success toast
      toast.success('Expense added successfully!', {
        position: toast.POSITION.TOP_CENTER,
      });

      // Redirect to the expense list page after successful submission
      navigate('/expenses');
    }else {
      console.error('User information not found. Please log in');
      toast.error('Error adding income. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-center mt-4">Record New Expense</h1>
      <Container className="mt-4" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
        <Row>
          {/* Left Column - Image Placeholder */}
          <Col md={3}>
            <img
              src="https://www.shutterstock.com/image-photo/unrecognizable-lady-working-on-family-260nw-2032739630.jpg"
              alt="Left Image"
              style={{ maxWidth: '100%', borderRadius: '5px',marginTop:'150px' }}
            />
          </Col>

          {/* Center Column - Form */}
          <Col md={6}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.title && errors.title && <p className="text-danger">{errors.title}</p>}
              </Form.Group>
              <Form.Group controlId="formAmount" className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.amount && errors.amount && <p className="text-danger">{errors.amount}</p>}
              </Form.Group>
              <Form.Group controlId="formCategory" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.category && errors.category && <p className="text-danger">{errors.category}</p>}
              </Form.Group>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.description && errors.description && (
                  <p className="text-danger">{errors.description}</p>
                )}
              </Form.Group>
              <Form.Group controlId="formDate" className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.date && errors.date && <p className="text-danger">{errors.date}</p>}
              </Form.Group>

              <Button variant="primary" type="submit">
                Add Expense
              </Button>
            </Form>
          </Col>

          <Col md={3}>
            <img
              src="https://media.freshbooks.com/wp-content/uploads/2022/02/expense-tracking.jpg"
              alt="Right Image"
              style={{ maxWidth: '100%', borderRadius: '5px',marginTop:'150px' }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddExpense;