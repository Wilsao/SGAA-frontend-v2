// src/layout/PublicLayout.js
import React from 'react';
import { SiteContent, AppFooter, AppHeader } from '../components';

const PublicLayout = () => {
  return (
    <div className="d-flex">
      <div className="wrapper d-flex flex-column min-vh-100 w-100">
        {/* <AppHeader /> */}
        <div className="body flex-grow-1 px-3">
          <SiteContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default PublicLayout;
