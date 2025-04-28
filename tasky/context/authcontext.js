// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for user in localStorage (temporary solution until backend)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function (will connect to backend later)
  const login = (email, password) => {
    setError(null);
    
    // For now, just simulate a successful login
    try {
      // In a real app, we'd verify credentials with an API
      const user = { id: '1', email, name: email.split('@')[0] };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      return false;
    }
  };

  // Mock register function
  const register = (name, email, password) => {
    setError(null);
    
    try {
      // In a real app, we'd register with an API
      const user = { id: '1', email, name };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (err) {
      setError("Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};