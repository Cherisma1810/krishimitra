import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('krishi_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('krishi_token');
      if (savedToken) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          console.error("Session verification failed:", err);
          localStorage.removeItem('krishi_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (phoneNumber, password) => {
    const data = await authService.login(phoneNumber, password);
    localStorage.setItem('krishi_token', data.access_token);
    setToken(data.access_token);
    const profile = await authService.getProfile();
    setUser(profile);
    return profile;
  };

  const logout = () => {
    localStorage.removeItem('krishi_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);