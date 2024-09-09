// src/views/pages/home/Home.js
import React from 'react';
import { CButton, CContainer, CRow, CCol } from '@coreui/react';

const Home = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} className="text-center">
            <h1>Bem-vindo ao Nosso Site!</h1>
            <p className="text-medium-emphasis">
              Esta é a página inicial pública do site. Explore nossos conteúdos e aproveite.
            </p>
            <CButton color="primary" href="#/login">
              Faça Login
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Home;
