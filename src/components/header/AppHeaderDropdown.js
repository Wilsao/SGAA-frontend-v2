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

import avatar8 from './../../assets/images/avatars/8.jpg';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store';

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/home');
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Lembrete</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tarefas
          <CBadge color="danger" className="ms-2">
            3
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Configurações</CDropdownHeader>
        <CDropdownItem href="#/admin/usuario/editar/2">
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
