import './App.css';
import Landing from './components/LandingPage';
import Dashboard from './components/patient/dashboard/Dashboard';
import Signup from './components/patient/signup/Signup';
import Login from './components/patient/login/Login';
import DLogin from './components/doctor/login/DLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DSignup from './components/doctor/signup/DSignup';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/patient/signup' element={<Signup />} />
          <Route path='/patient/dashboard' element={<Dashboard />} />
          <Route path='/patient/login' element={<Login />} />
          <Route path='/doctor/login' element={<DLogin />} />
          <Route path='/doctor/DSignup' element={<DSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
