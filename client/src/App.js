import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/LandingPage';
import Dashboard from './components/patient/dashboard/Dashboard';
import Signup from './components/patient/signup/Signup';
import Login from './components/patient/login/Login';
import DDashboard from './components/doctor/dashboard/Dashboard';
import DLogin from './components/doctor/login/DLogin';
import DSignup from './components/doctor/signup/DSignup';
import AuthProvider from './components/AuthContext';
import PatientProtected from './components/patient/PatientProtected';
import DoctorProtected from './components/doctor/DoctorProtected';
import PatientDetails from './components/doctor/dashboard/PatientDetails';

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/patient/signup' element={<Signup />} />
            <Route path='/patient/login' element={<Login />} />
            <Route element={<PatientProtected />}>
              <Route path='/patient/dashboard' element={<Dashboard />} />
            </Route>
            <Route path='/doctor/dlogin' element={<DLogin />} />
            <Route path='/doctor/DSignup' element={<DSignup />} />
            <Route element={<DoctorProtected />}>
              <Route path='/doctor/dashboard' element={<DDashboard />} />
            </Route>
            <Route path="/doctor/dashboard/patient/:patientId" element={<PatientDetails />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
