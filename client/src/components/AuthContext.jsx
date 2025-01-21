import React, { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [user, setUser] = useState(null);

    const patientLoginAction = async (data) => {
        try {
            const response = await axios.post(
                'https://mediconnect-but5.onrender.com/api/patient/login',
                data,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const responseData = response.data;

            setToken(responseData.token);
            setRole(responseData.role);
            setUser(responseData.patient);

            // Store auth state
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('role', responseData.role);
            localStorage.setItem('user', JSON.stringify(responseData.patient));

            return { ok: true, data: responseData };
        } catch (err) {
            return {
                ok: false,
                error: err.response?.data?.message || 'No record or Invalid credentials',
            };
        }
    };

    const doctorLoginAction = async (data) => {
        try {
            const response = await axios.post(
                'https://mediconnect-but5.onrender.com/api/doctor/login',
                data,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const responseData = response.data;

            setToken(responseData.token);
            setRole(responseData.role);
            setUser(responseData.doctor);

            // Store auth state
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('role', responseData.role);
            localStorage.setItem('user', JSON.stringify(responseData.doctor));

            return { ok: true, data: responseData };
        } catch (err) {
            return {
                ok: false,
                error: err.response?.data?.message || 'No record or Invalid credentials',
            };
        }
    };

    const hospitalLoginAction = async (data) => {
        try {
            const response = await axios.post(
                'https://mediconnect-but5.onrender.com/api/hospital/login',
                data,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const responseData = response.data;

            setToken(responseData.token);
            setRole(responseData.role);
            setUser(responseData.hospital);

            // Store auth state
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('role', responseData.role);
            localStorage.setItem('user', JSON.stringify(responseData.hospital));

            return { ok: true, data: responseData };
        } catch (err) {
            return {
                ok: false,
                error: err.response?.data?.message || 'No record or Invalid credentials',
            };
        }
    };

    const logout = () => {
        // Clear state
        setToken("");
        setRole("");
        setUser(null);

        // Clear stored data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
    };

    const isAuthenticated = () => !!token;

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                user,
                patientLoginAction,
                doctorLoginAction,
                hospitalLoginAction,
                logout,
                isAuthenticated,
                getAuthHeaders,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
