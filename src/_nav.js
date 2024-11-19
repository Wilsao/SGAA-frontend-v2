// src/_nav.js
import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilList,
  cilDollar,
  cilPaw,
  cilHeart,
  cilUser,
  cilHome,
  cilInfo,
  cilContact,
  cilMedicalCross,
} from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const navItems = [
  {
    component: CNavItem,
    name: 'Animais disponíveis',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    acesslevel: 3,
  },
  {
    component: CNavItem,
    name: 'Sobre',
    to: '/about',
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
    acesslevel: 3,
  },
  {
    component: CNavItem,
    name: 'Contato',
    to: '/contact',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
    acesslevel: 3,
  },
  {
    component: CNavTitle,
    name: 'Gerenciamento',
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Animais',
    to: '/admin/animais',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" />,
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Castrações',
    to: '/admin/castracoes',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Eventos de Arrecadação',
    to: '/admin/arrecadacoes',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Usuários',
    to: '/admin/usuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    acesslevel: 1,
  },
  {
    component: CNavItem,
    name: 'Pessoas',
    to: '/admin/pessoas',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    accesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Adoções',
    to: '/admin/adocao',
    icon: <CIcon icon={cilHeart} customClassName="nav-icon" />,
    accesslevel: 2,
  },
  {
    component: CNavTitle,
    name: 'Cadastros',
    acesslevel: 2,
  },
    {
    component: CNavItem,
    name: 'Status animais',
    to: '/admin/statusanimal',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" />,
    acesslevel: 2,
  },
    {
    component: CNavItem,
    name: 'Status adoção',
    to: '/admin/statusadocao',
    icon: <CIcon icon={cilPaw} customClassName="nav-icon" />,
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Espécies',
    to: '/admin/especies',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    acesslevel: 2,
  },
  {
    component: CNavItem,
    name: 'Cargos',
    to: '/admin/cargo',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    acesslevel: 1,
  },
];

export const getNavigation = (userRole) => {
  const useracesslevel = parseInt(userRole, 10);

  const filteredNavItems = navItems.filter((item) => {
    const itemacesslevel = item.acesslevel || 1;
    return useracesslevel <= itemacesslevel;
  });

  return filteredNavItems;
};
