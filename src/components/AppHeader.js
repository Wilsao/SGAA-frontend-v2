// src/components/AppHeader.js
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  useColorModes,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilContrast, cilMenu, cilMoon, cilSun, cilLockLocked } from '@coreui/icons';

import AppHeaderDropdown from './header/AppHeaderDropdown';
import { set } from '../store';

const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.ui.sidebarShow);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });
  }, []);

  const toggleSidebar = () => {
    dispatch(set({ sidebarShow: !sidebarShow }));
  };

  return (
    <CHeader className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler onClick={toggleSidebar} style={{ marginInlineStart: '-14px' }}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem active={colorMode === 'light'} onClick={() => setColorMode('light')}>
                <CIcon className="me-2" icon={cilSun} size="lg" /> Claro
              </CDropdownItem>
              <CDropdownItem active={colorMode === 'dark'} onClick={() => setColorMode('dark')}>
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Escuro
              </CDropdownItem>
              <CDropdownItem active={colorMode === 'auto'} onClick={() => setColorMode('auto')}>
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Automático
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {isLoggedIn ? (
            <AppHeaderDropdown />
          ) : (
            <CButton
              color="link"
              onClick={() => (window.location.href = '/#/login')}
              className="me-2"
            >
              <CIcon icon={cilLockLocked} size="lg" />
            </CButton>
          )}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default React.memo(AppHeader);
