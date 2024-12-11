// src/components/header/AppHeaderDropdown.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilTask, cilUser, cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

import avatar from './../../assets/images/avatars/usuario.png';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store';

const AppHeaderDropdown = () => {
  const userRoleName = useSelector((state) => state.auth.userRoleName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.auth.userId);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/home');
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">{userRoleName}</CDropdownHeader>
        <CDropdownItem href={`#/admin/usuario/editar/${userId}`}>
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Sair
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default React.memo(AppHeaderDropdown);
