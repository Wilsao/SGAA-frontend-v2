// src/views/admin/users/UsuarioForm.js

import React, { useState, useEffect } from 'react';

import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CAlert,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan, cilLockUnlocked, cilLockLocked } from '@coreui/icons';
import { useSelector } from 'react-redux';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.userRole) || '3';
  const userId = useSelector((state) => state.auth.userId);
  const loggedInUser = useSelector((state) => state.auth.user);
  const loggedInUserTipoUsuarioId = loggedInUser?.tipo_usuario_id;

  const [user, setUser] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    pergunta: '',
    resposta: '',
    tipo_usuario_id: '',
    status: 1,
  });
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResposta, setShowResposta] = useState(false);

  if(userRole != 1 && userId != id){
    navigate('/unauthorized');
  }

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await authFetch('http://localhost:3001/tipousuario', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar cargos');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Erro ao buscar cargos:', error);
        setErrorMessage('Erro ao buscar cargos.');
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (id && roles.length > 0) {
      const fetchUser = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/usuario/${id}`, {
            method: 'GET',
          });
          if (!response.ok) {
            throw new Error('Erro ao buscar usuário');
          }
          const data = await response.json();
          setUser({
            ...user,
            nome: data.nome,
            email: data.email,
            tipo_usuario_id: data.tipo_usuario_id || '',
            status: data.status ? 1 : 0,
            pergunta: data.pergunta || '',
            resposta: data.resposta || '',
          });
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          setErrorMessage('Erro ao buscar usuário.');
        }
      };
      fetchUser();
    }
  }, [id, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (user.senha && user.senha !== user.confirmarSenha) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/usuario${id ? `/${id}` : ''}`;

      const userData = { ...user };
      if (!user.senha) {
        delete userData.senha;
      }
      if (!user.pergunta) {
        delete userData.pergunta;
        delete userData.resposta;
      }
      delete userData.confirmarSenha;
      delete userData.status;
      userData.usuario_id = id;

      if (userRole == 3) {
        console.log('e')
        delete userData.tipo_usuario_id;
      }

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar usuário');
      }
      setSuccessMessage(`Usuário ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setErrorMessage('Erro ao salvar usuário.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="">
        <CCol md={12}>
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Informações' : 'Cadastrar Usuário'}</h2>
              <CForm onSubmit={handleSubmit}>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Nome</CFormLabel>
                    <CFormInput
                      type="text"
                      name="nome"
                      value={user.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>
                      Senha {id && <small>(deixe em branco para não alterar)</small>}
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        name="senha"
                        value={user.senha}
                        onChange={handleChange}
                        placeholder={id ? 'Nova senha' : ''}
                        required={!id}
                      />
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CIcon icon={showPassword ? cilLockLocked : cilLockUnlocked} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>
                      Confirmar Senha
                    </CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        name="confirmarSenha"
                        value={user.confirmarSenha}
                        onChange={handleChange}
                        placeholder={id ? 'Confirme a nova senha' : ''}
                        required={!id}
                      />
                      <CInputGroupText
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CIcon icon={showPassword ? cilLockLocked : cilLockUnlocked} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Pergunta de Segurança</CFormLabel>
                    <CFormInput
                      type="text"
                      name="pergunta"
                      value={user.pergunta}
                      onChange={handleChange}
                      placeholder="Digite a nova pergunta"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Resposta de Segurança</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type={showResposta ? 'text' : 'password'}
                        name="resposta"
                        value={user.resposta}
                        onChange={handleChange}
                        placeholder="Digite a nova resposta"
                      />
                      <CInputGroupText
                        onClick={() => setShowResposta(!showResposta)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CIcon icon={showResposta ? cilLockLocked : cilLockUnlocked} />
                      </CInputGroupText>
                    </CInputGroup>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  {userRole != 3 ? (
                    <CCol md={6}>
                      <CFormLabel>Cargo</CFormLabel>
                      <CFormSelect
                        name="tipo_usuario_id"
                        value={user.tipo_usuario_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione um cargo</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.nome}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  ) : ((<></>))}
                  {userRole != 3 ? (
                    <CCol md={6}>
                      <CFormLabel>Status</CFormLabel>
                      <CFormSelect name="status" value={user.status} onChange={handleChange}>
                        <option value={1}>Ativo</option>
                        <option value={0}>Inativo</option>
                      </CFormSelect>
                    </CCol>
                  ) : (<></>)}
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" />
                  {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                {/* <CButton color="secondary" onClick={() => navigate('/admin/usuarios')}>
                  <CIcon icon={cilBan} className="me-1" />
                  Cancelar
                </CButton> */}
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default UsuarioForm;
