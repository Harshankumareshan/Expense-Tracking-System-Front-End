import React, { useEffect } from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux"
import { loginUser } from '../redux/slices/users/userSlices';
import DisabledButton from '../components/DisableButton';
import { Link, useNavigate } from 'react-router-dom';

const formSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
})

export const Login = () => {

  //navigate
  const navigate = useNavigate()

//dispatch
  const dispatch = useDispatch()
//get data from store
  const user = useSelector((state) => state?.users)
console.log(user)
  const{userAppErr,userServerErr,userLoading,auth}=user;
  console.log(user);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      dispatch(loginUser(values))
    },
    validationSchema: formSchema
  });

  //Redirect
  useEffect(()=>{
     if(auth){
      navigate('/profile')
     }
  },[auth])
 
  return (
    <section 
    style={{height:"100vh"}}
    className="position-relative py-5 overflow-hidden">
      <img
        className="d-none d-lg-block position-absolute top-0 start-0 bottom-0 w-50 h-100 img-fluid"
        style={{ objectFit: 'cover'}}
        src="https://img.freepik.com/free-vector/log-orange-landing-page_23-2148284142.jpg"
        alt=""
      />
      <div className="position-relative">
        <div className="container">
          <div className="row pt-5">
            <div className="col-12 col-lg-5 ms-auto">
              <div className="mb-5">
                <h2 className="display-4 fw-bold mb-5">User Login</h2>

                {userAppErr || userServerErr ?(
                <div className='alert alert-danger' role='alert'>{userServerErr} {userAppErr}
                </div>):null}
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                    value={formik.values.email}
                    onChange={formik.handleChange('email')}
                    onBlur={formik.handleBlur("email")}
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="text-danger mb-2">
                    {formik.touched.email && formik.errors.email}

                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                    value={formik.values.password}
                    onChange={formik.handleChange('password')}
                    onBlur={formik.handleBlur("password")}
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="text-danger mb-2">
                    {formik.touched.password && formik.errors.password}

                  </div>
                  {userLoading ? (
                    <DisabledButton/>
                  ):(
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                  )}
                    <Link to="/signup" className="btn btn-primary" style={{marginLeft:"5px"}}>
                     Signup
                  </Link>
                </form>
                <div className="mt-4">
                
                <h2 style={{marginTop:'4%',color:"red",textAlign:'center'}}>DEMO LOGIN Id</h2>
                <h2 style={{marginTop:'4%'}}>Email - user123@gmail.com<h2>Password - 12345</h2></h2>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};