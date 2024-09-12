import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useAuth } from '../../AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await auth.patientLoginAction(formData);

      // console.log(user)

      // const data = await response.json();

      // console.log(data)

      if (user.ok) {
        toast.success('🎉 Login successful!', {
          position: 'top-center',
          className: 'custom-toast',
        });

        setFormData({
          email: '',
          password: '',
        });
        navigate('/patient/dashboard');
      } else {
        toast.error(user.error || '⚠️ Login failed. Please try again.', {
          position: 'top-center',
          className: 'custom-toast',
        });
      }
    } catch (error) {
      // toast.error(`Error: ${error.message}`, {
      //   position: 'top-center',
      //   className: 'custom-toast',
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/patient/signup');
  }

  return (
    <div className="login-page">
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content ">
          <button onClick={handleSignupClick}>Signup</button>
        </div>
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h3 style={{ margintop: '8px' }}>Patient Login</h3>
          <label htmlFor="email">Email</label>
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <label htmlFor="password">Password</label>
          <div className="input-group mb-3">
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            /></div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loggin in...' : 'Login'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
