// src/views/public/page404/Page404.js
import React from 'react';
import { CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="pt-5 d-flex flex-column align-items-center">
      <h1 className="display-1">404</h1>
      <p className="text-muted">A página que você está procurando não foi encontrada.</p>
      <CButton color="primary" onClick={handleBackToHome}>
        Voltar para a Página Inicial
      </CButton>
    </div>
  );
};

export default Page404;
