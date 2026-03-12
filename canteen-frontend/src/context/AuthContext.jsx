import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state directly from localStorage so it's ready on the very first frame
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });
    
    // Start loading as true if we have a token (to verify it), 
    // or false if we know we're logged out.
    const [loading, setLoading] = useState(false); 

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', { 
                email, 
                password 
            });
            
            const { token: newToken, user: userData } = response.data;
            
            // 1. Update localStorage FIRST (Synchronous)
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // 2. Update state (Asynchronous)
            setToken(newToken);
            setUser(userData);
            
            return true;
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);