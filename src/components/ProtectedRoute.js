// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, roles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.userRole);
  const hasSecurityQuestion = useSelector((state) => state.auth.hasSecurityQuestion);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasSecurityQuestion) {
    return <Navigate to="/definir-pergunta-de-seguranca" />;
  }

  if (roles && roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
