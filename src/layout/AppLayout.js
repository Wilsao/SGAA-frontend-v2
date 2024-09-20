// src/layout/AppLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CContainer } from '@coreui/react';

import AppHeader from '../components/AppHeader';
import AppSidebar from '../components/AppSidebar';

const AppLayout = () => {
  return (
    <div className="d-flex">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 w-100">
        <AppHeader />
        <CContainer className="flex-grow-1 px-3">
          <Outlet />
        </CContainer>
      </div>
    </div>
  );
};

export default AppLayout;
