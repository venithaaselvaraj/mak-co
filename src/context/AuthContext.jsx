import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Using local Node server for MongoDB Atlas interactions
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Note: Mock/Fallback mode has been removed in favor of direct MongoDB Atlas authentication

  async function signup(email, password, name, role = 'customer', phone = '') {
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password, phone, role });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      setCurrentUser({ uid: user.uid, email: user.email });
      setUserRole(user.role);
      setUserData(user);
      
      return response.data;
    } catch (error) {
      console.error('MongoDB Atlas Signup Error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  }

  async function login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      setCurrentUser({ uid: user.uid, email: user.email });
      setUserRole(user.role);
      setUserData(user);
      
      return response.data;
    } catch (error) {
      console.error('MongoDB Atlas Login Error:', error.response?.data || error);
      throw error.response?.data || error;
    }
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setUserRole(null);
    setUserData(null);
  }

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user } = response.data;
          
          setCurrentUser({ uid: user.uid, email: user.email });
          setUserRole(user.role);
          setUserData(user);
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    signup,
    login,
    logout,
    isAdmin: userRole === 'admin',
    isMock: false // Permanently disabled for MongoDB usage
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
