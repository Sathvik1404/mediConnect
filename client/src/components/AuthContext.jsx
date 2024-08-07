import React, { useEffect, useContext, createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        // console.log(storedRole, storedToken);

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
        }
    }, []);

    const loginAction = async (data) => {
        try {
            const response = await fetch('https://foodapp-0rh9.onrender.com/api/login', {
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
                setUser(responseData.user);
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('role', responseData.user.role);
                return responseData.user;
            }
            throw new Error(responseData.message);
        } catch (err) {
            console.error(err);
            alert("No record or invalid credentials")
        }
    };

    const logout = () => {
        setToken("");
        setRole("");
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ token, user, role, loginAction, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
