// src/App.js
import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import routes from './routes';

import ProtectedRoute from './components/ProtectedRoute';

const AppLayout = React.lazy(() => import('./layout/AppLayout'));
const Login = React.lazy(() => import('./views/public/login/Login'));
const Page404 = React.lazy(() => import('./views/public/page404/Page404'));
const Unauthorized = React.lazy(() => import('./views/public/Unauthorized'));

const App = () => {
  const dispatch = useDispatch();
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    if (isColorModeSet()) {
      return;
    }
    setColorMode(storedTheme);
  }, [isColorModeSet, setColorMode, storedTheme]);

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {routes.map((route, idx) => {
            if (route.children) {
              return (
                <Route key={idx} path={route.path} element={<AppLayout />}>
                  {route.children.map((child, cidx) => {
                    const { element, roles } = child;
                    const path = child.path;

                    if (roles && roles.length > 0) {
                      return (
                        <Route
                          key={cidx}
                          path={path}
                          element={<ProtectedRoute element={element} roles={roles} />}
                        />
                      );
                    } else {
                      return <Route key={cidx} path={path} element={element} />;
                    }
                  })}
                </Route>
              );
            } else {
              return (
                <Route key={idx} path={route.path} element={<AppLayout />}>
                  <Route index element={route.element} />
                </Route>
              );
            }
          })}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
