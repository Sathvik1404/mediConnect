import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/LandingPage';
import Dashboard from './components/patient/dashboard/Dashboard';
import Signup from './components/patient/signup/Signup';
import Login from './components/patient/login/Login';
import Pprofile from './components/patient/pprofile/Pprofile';
import DDashboard from './components/doctor/dashboard/Dashboard';
import DLogin from './components/doctor/login/DLogin';
import DSignup from './components/doctor/signup/DSignup';
import AuthProvider from './components/AuthContext';
import PatientProtected from './components/patient/PatientProtected';
import DoctorProtected from './components/doctor/DoctorProtected';
import PatientDetails from './components/doctor/dashboard/PatientDetails';
import HospitalDetails from './components/hospital/register/Register';
import Appointment from './components/patient/dashboard/appointment';

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
              <Route path='/patient/profile' element={<Pprofile />} />
              <Route path="/patient/appointment/:id" element={<Appointment />}></Route>
            </Route>
            <Route path='/doctor/dlogin' element={<DLogin />} />
            <Route path='/doctor/DSignup' element={<DSignup />} />
            <Route element={<DoctorProtected />}>
              <Route path='/doctor/dashboard' element={<DDashboard />} />
            </Route>
            <Route path="/doctor/dashboard/patient/:patientId" element={<PatientDetails />} />
            <Route path="/hospital/signup" element={<HospitalDetails />} />
          </Routes>

        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
