import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gymsuite_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gymsuite_access_token');
    if (token && !user) {
      api.get('/auth/profile/')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('gymsuite_user', JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (usernameOrEmail, password) => {
    const res = await api.post('/auth/login/', {
      username: usernameOrEmail,
      password: password,
    });

    const { access, refresh, user: userData } = res.data;
    localStorage.setItem('gymsuite_access_token', access);
    localStorage.setItem('gymsuite_refresh_token', refresh);
    localStorage.setItem('gymsuite_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register/', formData);
    const { access, refresh, user: userData } = res.data;
    localStorage.setItem('gymsuite_access_token', access);
    localStorage.setItem('gymsuite_refresh_token', refresh);
    localStorage.setItem('gymsuite_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('gymsuite_access_token');
    localStorage.removeItem('gymsuite_refresh_token');
    localStorage.removeItem('gymsuite_user');
    setUser(null);
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem('gymsuite_user', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
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
