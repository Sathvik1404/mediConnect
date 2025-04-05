import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, Hospital, UserPlus, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('patient');
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab, userType]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { name, email, password };
    const loginData = { email, password };

    const baseURL = "http://localhost:5000/api";
    let endpoint = "";
    let redirectPath = "";

    if (activeTab === "signup") {
      // if (!name) {
      //   toast.warning("Please enter your full name.");
      //   return;
      // }

      // if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(password)) {
      //   toast.warning("Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character");
      //   return;
      // }

      if (userType === "patient") {
        // endpoint = `${baseURL}/patient/signup`;
        redirectPath = "/patient/signup";
      } else if (userType === "doctor") {
        // endpoint = `${baseURL}/doctor/signup`;
        redirectPath = "/doctor/DSignup";
      } else if (userType === "hospital") {
        // endpoint = `${baseURL}/hospital/signup`;
        redirectPath = "/hospital/signup";
      }

      try {
        // const response = await axios.post(endpoint, formData, {
        //   headers: { "Content-Type": "application/json" },
        // });

        // if (response.status === 200 || response.status === 201) {
        if (true) {
          setName("");
          setEmail("");
          setPassword("");
          // toast.success("SignUp Successful");
          console.log(redirectPath)
          navigate(redirectPath);
          // setTimeout(() => {
          // }, 1000);
        } else {
          // toast.warning(response.data.error || "Signup failed. Please try again.");
        }
      } catch (err) {
        // toast.warning(err.response?.data?.error || err.message);
      }
    }

    // ✅ LOGIN logic is now outside the signup block
    else if (activeTab === "login") {
      if (userType === "patient") {
        // endpoint = `${baseURL}/patient/login`;
        redirectPath = "/patient/login";
      } else if (userType === "doctor") {
        // endpoint = `${baseURL}/doctor/login`;
        redirectPath = "/doctor/dlogin";
      } else if (userType === "hospital") {
        // endpoint = `${baseURL}/hospital/login`;
        redirectPath = "/hospital/dashboard";
      }

      try {
        // const response = await axios.post(endpoint, loginData, {
        //   headers: { "Content-Type": "application/json" },
        // });

        // if (response.status === 200) {
        if (true) {
          setEmail("");
          setPassword("");
          // toast.success("Login Successful");
          console.log(redirectPath)
          navigate(redirectPath);
          // setTimeout(() => {
          // }, 2000);
        } else {
          // toast.warning(response.data.error || "Login failed. Please try again.");
        }
      } catch (err) {
        // toast.warning(err.response?.data?.error || err.message);
      }
    }
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // Handle form submission - would connect to backend in real implementation
  //   console.log({ userType, email, password, name });
  //   if (userType === 'patient' && activeTab === 'signup') {
  //     const formData = { name, email, password }
  //     // if (formData.password !== formData.confirmPassword) {
  //     //   setError('Passwords do not match');
  //     //   return;
  //     // }
  //     // if (formData.mobile.length !== 10 || !/^[0-9]+$/.test(formData.mobile)) {
  //     //   setError('Invalid mobile number');
  //     //   return;
  //     // }

  //     if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(formData.password)) {
  //       // setError('Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character');
  //       return;
  //     }

  //     // setLoading(true);
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:5000/api/patient/signup',
  //         formData,
  //         {
  //           headers: { 'Content-Type': 'application/json' },
  //         }
  //       );

  //       if (response.status === 200 || response.status === 201) {
  //         // setSuccess(true);
  //         setName('')
  //         setEmail('')
  //         setPassword('')
  //         setTimeout(() => {
  //           navigate('/patient/dashboard');
  //         }, 2000);
  //       } else {
  //         // setError(response.data.error || 'Signup failed. Please try again.');
  //       }
  //     } catch (err) {
  //       // setError(err.response?.data?.error || err.message);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   } else if (userType === 'doctor' && activeTab === 'signup') {

  //   } else if (userType === 'hospital' && activeTab === 'signup') {

  //   } else if (userType === 'patient' && activeTab === 'login') {

  //   }
  //   else if (userType === 'doctor' && activeTab === 'login') {

  //   }
  //   else if (userType === 'hospital' && activeTab === 'login') {

  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Navigation */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-blue-900">MediConnect</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">For Patients</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">For Doctors</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Help</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-2xl bg-white">
          {/* Left Panel - Image and benefits */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 lg:p-12 relative overflow-hidden">
            <div className={`transition-all duration-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-95'}`}>
              <h2 className="text-3xl font-bold mb-6">Healthcare Simplified</h2>
              <p className="text-blue-100 text-lg mb-8">Join thousands of patients and healthcare providers on MediConnect's comprehensive platform.</p>

              <div className="space-y-6 mb-12">
                {[
                  { text: "Seamless appointment booking", delay: "100" },
                  { text: "Secure access to medical records", delay: "200" },
                  { text: "Direct communication with healthcare providers", delay: "300" },
                  { text: "Personalized health dashboard", delay: "400" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 bg-white/20 rounded-full p-1">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="ml-3 text-blue-50">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-700/50 to-transparent">
              <div className="w-40 h-40 bg-blue-400/20 rounded-full absolute -bottom-20 -left-20"></div>
              <div className="w-64 h-64 bg-indigo-400/20 rounded-full absolute -bottom-40 -right-20"></div>
            </div>

            <div className="absolute bottom-6 left-12 text-sm text-blue-200">
              <p>© 2025 MediConnect. All rights reserved.</p>
            </div>
          </div>

          {/* Right Panel - Auth Forms */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-blue-900">
                {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
              </h1>
              <div className="flex bg-gray-100 rounded-lg">
                <button
                  onClick={() => handleTabChange('login')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleTabChange('signup')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {activeTab === 'signup' || activeTab === 'login' ? (
              <div className="mb-8">
                <p className="text-gray-600 mb-3">I am a:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'patient', icon: <User className="h-5 w-5" />, label: 'Patient' },
                    { id: 'doctor', icon: <UserPlus className="h-5 w-5" />, label: 'Doctor' },
                    { id: 'hospital', icon: <Hospital className="h-5 w-5" />, label: 'Hospital' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleUserTypeChange(type.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${userType === type.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                    >
                      {type.icon}
                      <span className="mt-2 text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-95'}`}>
              {activeTab === 'signup' && (
                <div>
                  {/* <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label> */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <User className="h-5 w-5 text-gray-400" /> */}
                    </div>
                    {/* <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    /> */}
                  </div>
                </div>
              )}

              <div>
                {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label> */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <Mail className="h-5 w-5 text-gray-400" /> */}
                  </div>
                  {/* <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  /> */}
                </div>
              </div>

              <div>
                {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label> */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <Lock className="h-5 w-5 text-gray-400" /> */}
                  </div>
                  {/* <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={activeTab === 'login' ? "Enter your password" : "Create a password"}
                  /> */}
                </div>
              </div>

              {activeTab === 'login' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    /> */}
                    {/* <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label> */}
                  </div>
                  {/* <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
              )}

              {activeTab === 'signup' && (
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                {/* <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div> */}
              </div>

              {/* <div className="mt-6 grid grid-cols-3 gap-3">
                {['Google', 'Apple', 'Facebook'].map((provider) => (
                  <button
                    key={provider}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    {provider}
                  </button>
                ))}
              </div> */}
            </div>

            <div className="mt-8 text-center text-sm text-gray-600">
              {activeTab === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => handleTabChange('signup')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => handleTabChange('login')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;