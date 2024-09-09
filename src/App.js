// src/App.js

import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';

// Importa os componentes
const Login = React.lazy(() => import('./views/pages/login/Login'));
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
import ProtectedRoute from './components/ProtectedRoute'; // Importa o componente de rota protegida

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, [isColorModeSet, setColorMode, storedTheme]);

  return (
    <HashRouter>
      <Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Rota protegida: o usuário só pode acessar se estiver autenticado */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
