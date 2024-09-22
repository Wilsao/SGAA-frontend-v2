// src/_nav.js
import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilList,
  cilDollar,
  cilPaw,
  cilUser,
  cilHome,
  cilInfo,
  cilContact,
  cilMedicalCross,
} from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

// nav usuários públicos
export const nav_public = [
  {
    component: CNavItem,
    name: 'Animais disponíveis',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Sobre',
    to: '/about',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Contato',
    to: '/contact',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  },
  // Outros itens públicos..
];

// nav administradores
export const nav_admin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Gerenciamento',
  },
  {
    component: CNavItem,
    name: 'Animais',
    to: '/admin/animais',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Castrações',
    to: '/admin/castracoes',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Eventos de Arrecadação',
    to: '/admin/arrecadacoes',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Usuários',
    to: '/admin/usuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Cadastros',
  },
  {
    component: CNavItem,
    name: 'Espécies',
    to: '/admin/especies',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cargos',
    to: '/admin/cargo',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Páginas públicas',
  },
  // Outros itens de administrador..
];

export const getCombinedNav = (isAuthenticated, role) => {
  if (isAuthenticated && role === 'Administrador') {
    return [...nav_admin, ...nav_public];
  }
  return nav_public;
};
