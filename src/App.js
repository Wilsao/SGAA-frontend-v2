// src/App.js

import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';

import ProtectedRoute from './components/ProtectedRoute'; // Componente de rota protegida

// Importa os componentes das novas pastas organizadas
const Home = React.lazy(() => import('./views/public/home/Home'));
const Login = React.lazy(() => import('./views/public/login/Login'));
const AdminLayout = React.lazy(() => import('./layout/AdminLayout'));
const PublicLayout = React.lazy(() => import('./layout/PublicLayout'));
const Page404 = React.lazy(() => import('./views/public/page404/Page404'));
const Page500 = React.lazy(() => import('./views/public/page500/Page500'));

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
          {/* Rotas protegidas para a área administrativa com prefixo /admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Rotas públicas que usam o layout PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            {/* Definindo rotas públicas como filhos de PublicLayout */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="404" element={<Page404 />} />
            <Route path="500" element={<Page500 />} />
            {/* Qualquer rota não definida vai para a página 404 */}
            <Route path="*" element={<Page404 />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
