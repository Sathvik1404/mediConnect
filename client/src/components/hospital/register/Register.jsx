import React, { useEffect, useState } from 'react'
import './Register.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
  const navigate = useNavigate();
  const handleChange = () => {
    navigate('/hospital/login')
  };
  const [formData, setFormData] = useState({
    name: '',
    locatiton: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handlesubmit = () => {
    toast.success("Hospital Added Succesfully!")
  }

  return (
    <>
      {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></link> */}

      <div className="signup-page">
        <div className="navbar">
          <h3>mediConnect</h3>
          <div className="navbar-content">
            <button className="logout-btn" onClick={handleChange}>Logout</button>
          </div>
        </div>
        <div className="signup-container">
          <form action="" className="signup-form">
            <label htmlFor="name">Hospital Name:</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Ex.Gandhi" aria-label="Username" required />
            </div>
            <label htmlFor="location">Location :</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Ex.Hyderabad" aria-label="Username" required />
            </div>
            <label htmlFor="number">Telephone :</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Ex. 040-2346723" aria-label="Username" required />
            </div>
            <label htmlFor="email">Email</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Ex.abc@gmail.com" aria-label="Username" required />
            </div>
            <label htmlFor="email">Password</label>
            <div class="input-group mb-3">
              <input type="password" class="form-control" placeholder="Ex.*******" aria-label="Username" required />
            </div>
            <label htmlFor="email">Confirm Password</label>
            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="Ex.********" aria-label="Username" required />
            </div>
            <button class="btn btn-outline-success" onClick={handlesubmit}>Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register