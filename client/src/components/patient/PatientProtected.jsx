import React from 'react'
import { useAuth } from '../AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

const PatientProtected = () => {
    const { role, token } = useAuth();
    // console.log(role)
    if (!token && role !== "patient") {
        return <Navigate to="/patient/login" />
    }
    return <Outlet />
}

export default PatientProtected
