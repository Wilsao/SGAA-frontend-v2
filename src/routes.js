// src/routes.js
import React from 'react';

// Admin
const Dashboard = React.lazy(() => import('./views/admin/dashboard/Dashboard'));
const Animais = React.lazy(() => import('./views/admin/animais/Lista'));
const AnimaisCadastro = React.lazy(() => import('./views/admin/animais/AnimaisCadastro'));

// Public
const Home = React.lazy(() => import('./views/public/home/Home'));
const Login = React.lazy(() => import('./views/public/login/Login'));

const routes = [
  { path: '/home', exact: true, name: 'Home', element: <Home /> }, // Corrigido o nome da rota inicial
  { path: '/login', name: 'Login', element: <Login /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/animais/lista', name: 'Lista de Animais', element: <Animais /> },
  { path: '/animais/cadastro', name: 'Cadastro de Animais', element: <AnimaisCadastro /> }
];

export default routes;
