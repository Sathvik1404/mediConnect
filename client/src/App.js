import './App.css';
import Dashboard from './components/patient/dashboard/Dashboard';
import Signup from './components/patient/signup/Signup';
import Login from './components/patient/login/Login';
import DLogin from './components/doctor/login/DLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/patient/signup' element={<Signup />} />
          <Route path='/patient/dashboard' element={<Dashboard />} />
          <Route path='/patient/login' element={<Login />} />
          <Route path='/doctor/login' element={<DLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
