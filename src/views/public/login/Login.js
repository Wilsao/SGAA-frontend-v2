// src/views/pages/login/Login.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

// Importa as ações diretamente do arquivo store.js
import { loginUser, setAuthError } from '../../../store';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook para redirecionamento

  // Seleciona o estado de autenticação e de erro do Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authError = useSelector((state) => state.auth.error);

  // Verifica o estado de autenticação ao montar o componente
  useEffect(() => {
    // Se o usuário estiver autenticado, redireciona para o dashboard
    if (isAuthenticated) {
      navigate('/admin/dashboard'); // Redireciona para o dashboard
    }
  }, [isAuthenticated, navigate]); // Dependências do useEffect

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      dispatch(setAuthError('Por favor, preencha todos os campos.'));
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Despacha a ação de login com os dados do usuário
        dispatch(loginUser({ token: data.token, user: data.user }));
      } else {
        dispatch(setAuthError(data.message || 'Erro ao efetuar login.'));
      }
    } catch (error) {
      dispatch(setAuthError('Erro ao conectar ao servidor.'));
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleLogin}>
                  <h1>Login</h1>
                  <p className="text-medium-emphasis">Entre com suas credenciais</p>
                  {authError && <CAlert color="danger">{authError}</CAlert>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Usuário"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Senha"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" type="submit">
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
