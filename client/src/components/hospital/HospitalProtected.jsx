import React from 'react'
import { useAuth } from '../AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

const HospitalProtected = () => {
    const { role, token } = useAuth();
    // console.log(role)
    if (!token && role !== "hospital") {
        return <Navigate to="/hospital/Hlogin" />
    }
    return <Outlet />
}

export default HospitalProtected
