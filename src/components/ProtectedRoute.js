// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    // Redireciona para a página de login se o usuário não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  // Renderiza o componente filho se o usuário estiver autenticado
  return children;
};

export default ProtectedRoute;
