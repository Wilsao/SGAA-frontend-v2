// src/views/public/login/Login.js
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

import store, { loginUser, setAuthError } from '../../../store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authError = useSelector((state) => state.auth.error);

  useEffect(() => {
    console.log();
    if (isAuthenticated) {
      if(store.getState().auth.role != 'admin'){
        navigate('/home');
      }
      else{
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      dispatch(setAuthError('Por favor, preencha todos os campos.'));
      return;
    }

    try {
      console.log('Iniciando o processo de login...');
      const response = await fetch('http://localhost:3001/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        console.log('Login bem-sucedido, token recebido.');

        const userResponse = await fetch('http://localhost:3001/usuario/email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('Dados do usuário obtidos:', userData);

          let role = 'user'; // Valor padrão
          if (userData.usuario.tipo_usuario_id === 1) {
            role = 'admin'; // Tem acesso à parte administrativa
          }

          dispatch(
            loginUser({
              token: token,
              user: userData.usuario,
              role: role,
            })
          );

          navigate('/admin/dashboard');
        } else {
          dispatch(setAuthError('Erro ao obter dados do usuário.'));
        }
      } else {
        dispatch(setAuthError(data.message || 'Erro ao efetuar login.'));
      }
    } catch (error) {
      console.error('Erro no processo de login:', error);
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
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
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
