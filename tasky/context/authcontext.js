import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = (email, password) => {
    setError(null);
    
    try {
      const user = { id: '1', email, name: email.split('@')[0] };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      return false;
    }
  };
  
  const register = (name, email, password) => {
    setError(null);
    
    try {
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
