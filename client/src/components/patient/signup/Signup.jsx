import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Pointer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ArrowRight } from 'lucide-react';

const Signup = () => {
  const isScrolled = true
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.mobile.length !== 10 || !/^[0-9]+$/.test(formData.mobile)) {
      setError('Invalid mobile number');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(formData.password)) {
      setError('Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/patient/signup',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({
          name: '',
          gender: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          navigate('/patient/login');
        }, 2000);
      } else {
        setError(response.data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
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
              onClick={() => navigate('/patient/login')}
              className="w-full flex items-center justify-center py-2 px-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              SignIn
              <ArrowRight className="ml-2 h-5 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Join mediConnect</h2>
            <p className="mt-2 text-gray-600">Create your patient account to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
              <span>Account created successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <User className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="  Full Name"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  required
                />
              </div>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div className="relative flex items-center">
                <Phone className="absolute ml-1 mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="  Mobile Number"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  required
                />
              </div>

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

              <div className="relative flex items-center">
                <Lock className="absolute ml-1  mb-2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="  Confirm Password"
                  className="pl-10 w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
