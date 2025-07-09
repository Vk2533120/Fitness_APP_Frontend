import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/api.js'; // Import API functions
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true); 
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  let messageTimeoutRef = React.useRef(null);
  
  useEffect(() => {
    const loadUserFromToken = async () => {
      setLoading(true);
      if (token) {
        try {
          
          const response = await authApi.getUserProfile(); // Assuming this endpoint exists
          setUser(response.data.user || response.data); // Adjust based on your API response
          setMessage('Welcome back!');
          setIsError(false);
        } catch (e) {
          console.error("Token validation failed or user profile fetch error:", e);
          logout(); // Clear invalid token
          setMessage('Session expired or invalid. Please log in again.');
          setIsError(true);
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [token]); // Re-run if token changes

  const showContextMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => {
      setMessage('');
      setIsError(false);
    }, 3000); // Message disappears after 3 seconds
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData); // Set user data from login response
      showContextMessage('Login successful!', false);
      return true; // Indicate success
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showContextMessage(errorMessage, true);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser); // Set user data from register response
      showContextMessage('Registration successful! You are now logged in.', false);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed.';
      showContextMessage(errorMessage, true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setUser(null);
    showContextMessage('Logged out successfully.', false);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        message, 
        isError, 
        login,
        register,
        logout,
        showContextMessage, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

