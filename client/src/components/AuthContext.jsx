import React, { useContext, createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     // Restore authentication state from localStorage
    //     const storedToken = localStorage.getItem('token');
    //     const storedRole = localStorage.getItem('role');
    //     const storedUser = localStorage.getItem('user');

    //     if (storedToken && storedRole && storedUser) {
    //         setToken(storedToken);
    //         setRole(storedRole);
    //         setUser(JSON.parse(storedUser));
    //     }
    // }, []);

    const patientLoginAction = async (data) => {
        try {
            const response = await fetch('https://mediconnect-but5.onrender.com/api/patient/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.ok) {
                setToken(responseData.token);
                setRole(responseData.role);
                setUser(responseData.patient);

                // Store auth state
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('role', responseData.role);
                localStorage.setItem('user', JSON.stringify(responseData.patient));

                return {
                    ok: true,
                    data: responseData
                };
            }

            return {
                ok: false,
                error: responseData.message || 'Invalid credentials'
            };
        } catch (err) {
            return {
                ok: false,
                error: 'No record or Invalid credentials'
            };
        }
    };

    const doctorLoginAction = async (data) => {
        try {
            const response = await fetch('https://mediconnect-but5.onrender.com/api/doctor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.ok) {
                setToken(responseData.token);
                setRole(responseData.role);
                setUser(responseData.doctor);

                // Store auth state
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('role', responseData.role);
                localStorage.setItem('user', JSON.stringify(responseData.doctor));

                return {
                    ok: true,
                    data: responseData
                };
            }

            return {
                ok: false,
                error: responseData.message || 'Invalid credentials'
            };
        } catch (err) {
            return {
                ok: false,
                error: 'No record or Invalid credentials'
            };
        }
    };

    const hospitalLoginAction = async (data) => {
        try {
            const response = await fetch('https://mediconnect-but5.onrender.com/api/hospital/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.ok) {
                setToken(responseData.token);
                setRole(responseData.role);
                setUser(responseData.hospital);

                // Store auth state
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('role', responseData.role);
                localStorage.setItem('user', JSON.stringify(responseData.hospital));

                return {
                    ok: true,
                    data: responseData
                };
            }

            return {
                ok: false,
                error: responseData.message || 'Invalid credentials'
            };
        } catch (err) {
            return {
                ok: false,
                error: 'No record or Invalid credentials'
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

    // Additional helper methods
    const isAuthenticated = () => !!token;

    const getAuthHeaders = () => ({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
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
                getAuthHeaders
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