import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ROLE_PERMISSIONS: Maps roles to the list of page IDs they can access
const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'assets', 'risk', 'prediction', 'maintenance', 'crew', 'map'],
  technician: ['dashboard', 'assets', 'maintenance', 'crew'],
  viewer: ['dashboard', 'assets', 'risk', 'prediction']
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved token on load
  useEffect(() => {
    const savedUser = localStorage.getItem('voltguard_user');
    const token = localStorage.getItem('voltguard_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      // In a real app, you might verify the token with the backend here
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      // Force Indian persona names for demo purposes regardless of backend db state
      if (userData.role === 'admin') {
        userData.name = 'Ananya Sharma';
        userData.title = 'Grid Operations Director';
      } else if (userData.role === 'technician') {
        userData.name = 'Rahul Verma';
        userData.title = 'Lead Field Technician';
      } else if (userData.role === 'viewer') {
        userData.name = 'Dr. Vikram Singh';
        userData.title = 'Data Scientist';
      }

      setUser(userData);
      localStorage.setItem('voltguard_user', JSON.stringify(userData));
      localStorage.setItem('voltguard_token', token);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to authenticate. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voltguard_user');
    localStorage.removeItem('voltguard_token');
  };

  const hasAccess = (pageId) => {
    if (!user) return false;
    const allowedPages = ROLE_PERMISSIONS[user.role] || [];
    return allowedPages.includes(pageId);
  };

  const getAllowedPages = () => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasAccess, getAllowedPages }}>
      {children}
    </AuthContext.Provider>
  );
};
