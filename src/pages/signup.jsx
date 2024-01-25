import React, { useEffect } from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux"
import { signupUser } from '../redux/slices/users/userSlices';
import { useNavigate } from 'react-router-dom';
import DisabledButton from '../components/DisableButton';

//form validation
const formSchema = Yup.object({
  username:Yup.string().required("User Name is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
})

export const Signup = () => {
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
      username: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
       dispatch(signupUser(values))
    },
    validationSchema: formSchema
  });

  useEffect(()=>{
    if(auth){
     navigate("/login")
    }
 },[auth,navigate])
 
 
  return (
    <section style={{ height: "100vh" }} className="position-relative py-5 overflow-hidden">
      <img
        className="d-none d-lg-block position-absolute top-0 start-0 bottom-0 w-50 h-100 img-fluid"
        style={{ objectFit: 'cover' }}
        src="https://www.cozmoslabs.com/wp-content/uploads/2020/07/762227_Cozmoslabs-WordPress-Signup-Form_Op1_1_070620.png"
        alt=""
      />
      <div className="position-relative">
        <div className="container">
          <div className="row pt-5">
            <div className="col-12 col-lg-5 ms-auto">
              <div className="mb-5">
                <h2 className="display-4 fw-bold mb-5">User Signup</h2>
                {userAppErr || userServerErr ?(
                <div className='alert alert-danger' role='alert'>{userServerErr} {userAppErr}
                </div>):null}
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      User Name
                    </label>
                    <input
                     value={formik.values.username}
                     onChange={formik.handleChange('username')}
                     onBlur={formik.handleBlur("username")}
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter your full name"
                    />
                   
                  </div>
                  <div className="text-danger mb-2">
                    {formik.touched.username && formik.errors.username}
                  </div>
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
                      placeholder="Create a password"
                    />
                  </div>
                  <div className="text-danger mb-2">
                    {formik.touched.password && formik.errors.password}
                  </div>
                  {userLoading ? (
                    <DisabledButton/>
                  ):(
                  <button type="submit" className="btn btn-primary">
                    Signup
                  </button>
                  )}
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};