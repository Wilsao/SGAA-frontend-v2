// src/components/AppSidebar.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CCloseButton,
  CSidebar,
  CRow,
  CCol,
  CButton,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

import { useNavigate, useParams } from 'react-router-dom';
import { AppSidebarNav } from './AppSidebarNav';
import { logo } from 'src/assets/svg/logo';
import { sygnet } from 'src/assets/svg/sygnet';
import { set } from '../store';

import { getNavigation } from '../_nav';

const AppSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleVisibleChange = (visible) => {
    dispatch(set({ sidebarShow: visible }));
  };

  const handleToggleSidebar = () => {
    dispatch(set({ sidebarShow: false }));
  };

  const handleToggleUnfoldable = () => {
    dispatch(set({ sidebarUnfoldable: !unfoldable }));
  };

  const userRole = useSelector((state) => state.auth.userRole) || '3';
  const navItems = getNavigation(userRole);

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={handleVisibleChange}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton className="d-lg-none" dark onClick={handleToggleSidebar} />
      </CSidebarHeader>
      <AppSidebarNav items={navItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler onClick={handleToggleUnfoldable} />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
