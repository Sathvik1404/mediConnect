import React, { useState } from 'react';
import './Register.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.mobile.length !== 10 || !/^[0-9]+$/.test(formData.mobile)) {
      window.dispatchEvent(new CustomEvent('notify', { detail: { message: 'cross check your mobile number!', type: 'error' } }));
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(formData.password)) {
      window.dispatchEvent(new CustomEvent('notify', { detail: { message: 'Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character', type: 'error' } }));
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await fetch('https://mediconnect-but5.onrender.com/api/hospital/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Signup successful!', {
          position: 'top-center',
          className: 'custom-toast',
        });

        setFormData({
          name: '',
          location: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
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
      setLoading(false); // Stop loading
    }
  };

  const handleLogout = () => {
    navigate('/hospital/login');
  };

  return (
    <>
      <div className="signup-page">
        <div className="navbar">
          <h3>mediConnect</h3>
          <div className="navbar-content">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="signup-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Hospital Name:</label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex.Gandhi"
                required
              />
            </div>

            <label htmlFor="location">Location:</label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex.Hyderabad"
                required
              />
            </div>

            <label htmlFor="mobile">Telephone:</label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Ex. 040-2346723"
                required
              />
            </div>

            <label htmlFor="email">Email:</label>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex.abc@gmail.com"
                required
              />
            </div>

            <label htmlFor="password">Password:</label>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ex.*******"
                required
              />
            </div>

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ex.********"
                required
              />
            </div>

            <button type="submit" className="btn btn-outline-success" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Register;
