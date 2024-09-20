// src/views/public/page500/Page500.js
import React from 'react';
import { CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const Page500 = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1 className="display-1">500</h1>
      <p className="text-muted">Ocorreu um erro interno no servidor.</p>
      <CButton color="primary" onClick={handleBackToHome}>
        Voltar para a Página Inicial
      </CButton>
    </div>
  );
};

export default Page500;
