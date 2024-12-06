// src/layout/AppLayout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CContainer } from '@coreui/react';

import AppHeader from '../components/AppHeader';
import AppSidebar from '../components/AppSidebar';

import HelpModal from '../components/HelpModal';

const AppLayout = () => {
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <div className="d-flex">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 w-100">
        <AppHeader />
        <CContainer className="flex-grow-1 px-3">
          <Outlet />
        </CContainer>

        {/* Botão Flutuante de Ajuda */}
        <button className="fab-help" onClick={() => setHelpVisible(true)}>
          ?
        </button>

        <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
      </div>
    </div>
  );
};

export default AppLayout;
