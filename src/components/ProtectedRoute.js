// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, roles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
