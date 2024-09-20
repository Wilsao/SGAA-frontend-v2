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
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nome: '',
    email: '',
    senha: '',
    cargo: '',
    ativo: true,
  });
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await authFetch('http://localhost:3001/role', { method: 'GET' });
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
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/usuario/${id}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erro ao buscar usuário');
          }
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          setErrorMessage('Erro ao buscar usuário.');
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/usuario${id ? `/${id}` : ''}`;
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar usuário');
      }
      setSuccessMessage(`Usuário ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
      setTimeout(() => {
        navigate('/usuarios');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setErrorMessage('Erro ao salvar usuário.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Usuário' : 'Cadastrar Usuário'}</h2>
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
                {!id && (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CFormLabel>Senha</CFormLabel>
                      <CFormInput
                        type="password"
                        name="senha"
                        value={user.senha}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Confirmar Senha</CFormLabel>
                      <CFormInput
                        type="password"
                        name="confirmarSenha"
                        value={user.confirmarSenha}
                        onChange={handleChange}
                        required
                      />
                    </CCol>
                  </CRow>
                )}
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Cargo</CFormLabel>
                    <CFormSelect
                      name="cargo"
                      value={user.cargo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione um cargo</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.nome}>
                          {role.nome}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect
                      name="ativo"
                      value={user.ativo}
                      onChange={handleChange}
                    >
                      <option value={true}>Ativo</option>
                      <option value={false}>Inativo</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" />
                  {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/usuarios')}>
                  <CIcon icon={cilBan} className="me-1" />
                  Cancelar
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}

export default UsuarioForm;
