import React from 'react'
import { useAuth } from '../AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

const DoctorProtected = () => {
    const { role, token } = useAuth();
    // console.log(role)
    if (!token && role !== "doctor") {
        return <Navigate to="/doctor/dlogin" />
    }
    return <Outlet />
}

export default DoctorProtected
