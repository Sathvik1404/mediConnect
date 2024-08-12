import React, { useContext, createContext, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const storedToken = localStorage.getItem('token');
    //     const storedRole = localStorage.getItem('role');
    //     // console.log(storedRole, storedToken);

    //     if (storedToken && storedRole) {
    //         setToken(storedToken);
    //         setRole(storedRole);
    //     }
    // }, []);

    const patientLoginAction = async (data) => {
        try {
            const response = await fetch('http://localhost:5000/api/patient/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            // console.log(responseData)
            if (response.ok) {
                setToken(responseData.token);
                setRole(responseData.role);
                setUser(responseData.patient);
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', responseData.patient._id);
                return response;
            }
            throw new Error(responseData.message);
        } catch (err) {
            toast.error(`No record or Invalid credentials`, {
                position: 'top-center',
                className: 'custom-toast',
            });
        }
    };

    const doctorLoginAction = async (data) => {
        // console.log(data)
        try {
            const response = await fetch('http://localhost:5000/api/doctor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            // console.log(response)
            if (response.ok) {
                setToken(responseData.token);
                setRole(responseData.role);
                setUser(responseData.doctor);
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', responseData.doctor._id);
                return response;
            }
            throw new Error(responseData.message);
        } catch (err) {
            toast.error(`No record or Invalid credentials`, {
                position: 'top-center',
                className: 'custom-toast',
            });
        }
    };

    const logout = () => {
        setToken("");
        setRole("");
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ token, role, user, patientLoginAction, doctorLoginAction, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
