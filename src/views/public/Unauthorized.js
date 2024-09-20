// src/views/public/Unauthorized.js
import React from 'react';
import { CContainer, CRow, CCol } from '@coreui/react';

const Unauthorized = () => {
  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md="8" className="text-center">
          <h1>Acesso não autorizado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Unauthorized;
