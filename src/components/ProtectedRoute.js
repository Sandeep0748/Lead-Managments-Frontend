import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, user } = useContext(AuthContext);

  // Check if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is not an admin
  if (!isAdmin) {
    console.warn('Access denied: User is not an admin', user);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
