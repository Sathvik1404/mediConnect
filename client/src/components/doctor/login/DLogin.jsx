import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './DLogin.css';
import { useNavigate } from 'react-router-dom';
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
      // console.log(formData)
      const user = await auth.doctorLoginAction(formData);

      console.log(user)

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
        navigate('/doctor/dashboard');
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
    navigate('/doctor/dsignup');
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
          <h3 style={{ margintop: '8px' }}>Doctor Login</h3>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
