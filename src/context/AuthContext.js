import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback((user, token) => {
    // Ensure user has role property for admin panel access
    const userWithRole = {
      ...user,
      role: user.role || 'admin',
    };
    setUser(userWithRole);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userWithRole));
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
