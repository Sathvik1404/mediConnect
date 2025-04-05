import React, { useState } from 'react';
import { Mail, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { Heart, ArrowRight } from 'lucide-react';
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'srikarmarikanti@gmail.com', // Your Gmail address
//     pass: 'oyty yzub gpmv xvor',    // Your App Password
//   },
// })

const Login = () => {
  const isScrolled = true
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await auth.patientLoginAction(formData);

      if (result.ok) {
        // setNotification({ type: 'success', message: '🎉 Login successful!' });
        const otp = Math.floor(100000 + Math.random() * 900000);

        // const mailOptions = {
        //   from: 'srikarmarikanti@gmail.com', // Sender address
        //   to: formData.email, // Recipient address
        //   subject: 'Test Email from Nodemailer', // Subject
        //   text: otp, // Plain text body
        //   html: `<b>${otp}</b>`, // HTML body
        // };

        // // Send the email
        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //     return console.error('Error:', error);
        //   }
        //   console.log('Email sent:', info.response);
        // });
        sessionStorage.setItem('otp', otp); // Save OTP temporarily
        sessionStorage.setItem('email', formData.email);
        console.log(otp)
        navigate('/patient/Verify');
      } else {
        setNotification({ type: 'error', message: result.error });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  const sendOTP = async (email, otp) => {
    try {
      await window.Email.send({
        Host: 'smtp.elasticemail.com',
        Username: 'golisathu@gmail.com',
        Password: 'BD3254FB9DB4883CB42ECB69B7C9642F4240',
        To: email,
        From: 'golisathu@gmail.com',
        Subject: 'Your OTP for Login',
        Body: `Your OTP is: ${otp}`,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-blue-900" onClick={() => navigate('/authpage')} style={{ cursor: 'pointer' }}>MediConnect</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/patient/signup')}
              className="w-full flex items-center justify-center py-2 px-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              SignUp
              <ArrowRight className="ml-2 h-5 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Login to your patient account</p>
          </div>

          {notification && (
            <div className={`mb-6 p-4 rounded-md ${notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
              {notification.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <Mail className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="  Email Address"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  required
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="  Password"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
              <ArrowRight className="ml-2 h-5 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;