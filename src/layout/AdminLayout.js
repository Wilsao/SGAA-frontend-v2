// src/layout/AdminLayout.js
import React from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components';

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 w-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  );
};

export default AdminLayout;
