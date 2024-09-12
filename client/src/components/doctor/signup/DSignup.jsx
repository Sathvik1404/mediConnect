import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './DSingup.css';
import 'bootstrap/dist/css/bootstrap.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    spec: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleothers = () => {
    document.querySelector(".hideapp").style.display = "inherit";
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!', {
        position: 'top-center',
        className: 'custom-toast',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/doctor/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log(data)

      if (response.ok) {
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          className: 'custom-toast',
        });

        setFormData({
          name: '',
          age: '',
          gender: '',
          mobile: '',
          email: '',
          password: '',
          spec: '',
        });
      } else {
        toast.error(data.error || '⚠️ Signup failed. Please try again.', {
          position: 'top-center',
          className: 'custom-toast',
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: 'top-center',
        className: 'custom-toast',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/doctor/dlogin')
  }

  return (
    <div className="signup-page">
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content ">
          <button onClick={handleLoginClick}>Login</button>
        </div>
      </div>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h3 style={{ margintop: '8px' }}>Doctor Signup</h3>

          <label htmlFor="name">Name</label>
          <div className="input-group mb-3">
            <input
              className="form-contorl"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <label htmlFor="spec">Specialization</label>
          <select class="form-select" aria-label="Default select example">
            <option selected><b>Select Specialization</b></option>
            <option value="1">Cardiology</option>
            <option value="2">Dermatology</option>
            <option value="3">Nuerology</option>
            <option value="4">Orthopedics</option>
            <option value="5">Pediatrics</option>
            <option value="6">General Physician</option>
            <option value="7">Psychiatry</option>
            <option value="8">Radiology</option>
            <option value="9" onClick={handleothers}>Others</option>
          </select>
          <div className="hideadd">
            <label htmlFor="speci">Add Speciliazation</label>
            <div className="input-group mb-3">
              <input
                className="form-contorl"
                type="text"
                required
              ></input>
            </div>
          </div>
          {/* <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select> */}

          <label htmlFor="mobile">Mobile</label>
          <div className="input-group mb-3">
            <input
              className="form-contol"
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            /></div>

          <label htmlFor="email">Email</label>
          <div className="input-group mb-3">
            <input
              className="form-contol"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            /></div>

          <label htmlFor="password">Password</label>
          <div className="input-group mb-3">
            <input
              className="form-contol"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            /></div>

          <label htmlFor="confirmPassword">Re-enter Password</label>
          <div className="input-group mb-3">
            <input
              className="form-contol"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            /></div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>

          {/* <div className="redirect-login">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </div> */}
        </form>
        <ToastContainer />
      </div >
    </div >
  );
};

export default Signup;
