// src/routes.js
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const Animais = React.lazy(() => import('./views/animais/lista'))
const AnimaisCadastro = React.lazy(() => import('./views/animais/AnimaisCadastro'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/animais/lista', name: 'Lista de Animais', element: <Animais /> },
  { path: '/animais/cadastro', name: 'Cadastro de Animais', element: <AnimaisCadastro /> },
]

export default routes
