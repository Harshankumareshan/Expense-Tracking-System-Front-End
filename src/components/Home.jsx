import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";


export const Home = () => {

  const navigate = useNavigate()

  // Check if the user is already logged in or signed up
  const isAuthenticated = useSelector((state) => state.users.auth);

  // Redirect function
  const redirectToProfileOrSignup = () => {
    console.log('Redirecting...');
    if (isAuthenticated) {
      console.log('Redirecting to profile...');
      navigate('/profile');
    } else {
      console.log('Redirecting to signup...');
      navigate('/signup');
    }
  };
  
  
  return (
    <section 
    style={{height:"100vh"}}
    className='position-relative pb-5'>
      <img
        className='d-none d-lg-block position-absolute top-0 start-0 bottom-0 w-50 h-100 img-fluid'
        style={{ objectFit: "cover" }}
        src='https://i0.wp.com/juntrax.com/blog/wp-content/uploads/2020/10/Expense-management-Juntrax.jpg?resize=840%2C708&ssl=1'
        alt=''
      />
      <div className="position-relative">
        <div className="container">
          <div className="row pt-5">
            <div className="col-12  col-lg-5 ms-auto">
              <div className="mb-5">
                <h2 className="display-6 fw-bold mb-5" style={{marginTop:'20%'}}>
                  Manage and Track Your Income & Expenses
                </h2>
                <h4 className=" text-muted mb-5">
                "Effortlessly monitor and manage your financial transactions with this comprehensive dashboard,
                 providing a detailed overview of your income and expenses. Additionally, 
                streamline your budgeting process with our robust expense tracking system."
                </h4>
                <div className="d-flex justify-content-center align-items-center flex-wrap">
                <h1 className="text-danger">
                Click Below Button
              </h1>
                  
                </div>
                <br/>
                <button
                    className='btn btn-primary me-2 mb-2 b-sm-0'
                    onClick={redirectToProfileOrSignup}
                  >
                    Track your performance
                  </button>

              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}