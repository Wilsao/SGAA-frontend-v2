// src/routes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Admin
const DashboardMain = React.lazy(() => import('./views/admin/dashboard/DashboardMain'));
const ArrecadacaoMain = React.lazy(() => import('./views/admin/arrecadacao/ArrecadacaoMain'));
const ArrecadacaoForm = React.lazy(() => import('./views/admin/arrecadacao/ArrecadacaoForm'));
const CastracaoMain = React.lazy(() => import('./views/admin/castracao/CastracaoMain'));
// const CastracaoCreate = React.lazy(() => import('./views/admin/castracao/CastracaoCreate'));
// const CastracaoEdit = React.lazy(() => import('./views/admin/castracao/CastracaoEdit'));
const CastracaoForm = React.lazy(() => import('./views/admin/castracao/CastracaoForm'));
const AnimalMain = React.lazy(() => import('./views/admin/animais/AnimalMain'));
const AnimalForm = React.lazy(() => import('./views/admin/animais/AnimalForm'));
const AnimalProntuario = React.lazy(() => import('./views/admin/animais/AnimalProntuario'));
const EspecieMain = React.lazy(() => import('./views/admin/especie/EspecieMain'));
const EspecieForm = React.lazy(() => import('./views/admin/especie/EspecieForm'));
const UsuarioMain = React.lazy(() => import('./views/admin/usuario/UsuarioMain'));
const UsuarioForm = React.lazy(() => import('./views/admin/usuario/UsuarioForm'));
const CargoMain = React.lazy(() => import('./views/admin/cargo/CargoMain'));
const CargoForm = React.lazy(() => import('./views/admin/cargo/CargoForm'));

// Public
const Home = React.lazy(() => import('./views/public/home/Home'));
const AnimaisView = React.lazy(() => import('./views/public/animais/AnimaisView'));
const Page404 = React.lazy(() => import('./views/public/page404/Page404'));
const Page500 = React.lazy(() => import('./views/public/page500/Page500'));
const Unauthorized = React.lazy(() => import('./views/public/Unauthorized'));

const routes = [
  {
    path: '/',
    children: [
      { path: '/home', name: 'Home', element: <Home /> },
      { path: 'animal/:id/', name: 'Animal', element: <AnimaisView /> },
      { path: '404', name: 'Page 404', element: <Page404 /> },
      { path: '500', name: 'Page 500', element: <Page500 /> },
      { path: 'unauthorized', name: 'Unauthorized', element: <Unauthorized /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },

  {
    path: '/admin',
    children: [
      { path: 'dashboard', name: 'Dashboard', element: <DashboardMain />, roles: ['Administrador'] },
      { path: 'usuarios', name: 'Lista de Usuarios', element: <UsuarioMain />, roles: ['Administrador'] },
      { path: 'usuario/novo', name: 'Cadastro de Usuário', element: <UsuarioForm />, roles: ['Administrador'] },
      { path: 'usuario/editar/:id', name: 'Editar Usuário', element: <UsuarioForm />, roles: ['Administrador'] },
      { path: 'animais', name: 'Lista de Animais', element: <AnimalMain />, roles: ['Administrador'] },
      { path: 'animal/novo', name: 'Cadastro de Animais', element: <AnimalForm />, roles: ['Administrador'] },
      { path: 'animal/editar/:id', name: 'Editar Animal', element: <AnimalForm />, roles: ['Administrador'] },
      { path: 'animal/:id/prontuario', name: 'Editar Animal', element: <AnimalProntuario />, roles: ['Administrador'] },
      { path: 'arrecadacoes', name: 'Eventos de Arrecadação', element: <ArrecadacaoMain />, roles: ['Administrador'] },
      { path: 'arrecadacao/novo', name: 'Cadastrar Evento de Arrecadação', element: <ArrecadacaoForm />, roles: ['Administrador'] },
      { path: 'arrecadacao/editar/:id', name: 'Editar Evento de Arrecadação', element: <ArrecadacaoForm />, roles: ['Administrador'] },
      { path: 'castracoes', name: 'Eventos de Castração', element: <CastracaoMain />, roles: ['Administrador'] },
      { path: 'castracao/novo', name: 'Cadastrar Evento de Castração', element: <CastracaoForm />, roles: ['Administrador'] },
      { path: 'castracao/editar/:id', name: 'Editar Evento de Castração', element: <CastracaoForm />, roles: ['Administrador'] },
      // { path: 'castracao/novo', name: 'Cadastrar Evento de Castração', element: <CastracaoCreate />, roles: ['Administrador'] },
      // { path: 'castracao/editar/:id', name: 'Editar Evento de Castração', element: <CastracaoEdit />, roles: ['Administrador'] },
      { path: 'especies', name: 'Lista de Espécies', element: <EspecieMain />, roles: ['Administrador'] },
      { path: 'especie/novo', name: 'Cadastro de Espécie', element: <EspecieForm />, roles: ['Administrador'] },
      { path: 'especie/editar/:id', name: 'Editar Espécie', element: <EspecieForm />, roles: ['Administrador'] },
      { path: 'usuarios', name: 'Lista de Usuários', element: <UsuarioMain />, roles: ['Administrador'] },
      { path: 'usuario/novo', name: 'Cadastro de Usuário', element: <UsuarioForm />, roles: ['Administrador'] },
      { path: 'usuario/editar/:id', name: 'Editar Usuário', element: <UsuarioForm />, roles: ['Administrador'] },
      { path: 'cargo', name: 'Lista de Cargos', element: <CargoMain />, roles: ['Administrador'] },
      { path: 'cargo/novo', name: 'Cadastro de Cargo', element: <CargoForm />, roles: ['Administrador'] },
      { path: 'cargo/editar/:id', name: 'Editar Cargo', element: <CargoForm />, roles: ['Administrador'] },
      { path: '*', element: <Navigate to="/admin/dashboard" /> },
    ],
  },
];

export default routes;
