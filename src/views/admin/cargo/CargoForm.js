// src/views/admin/cargos/CargoForm.js
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CAlert,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import CIcon from '@coreui/icons-react';
import { cilSave, cilBan } from '@coreui/icons';

function CargoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState({ nome: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchRole = async () => {
        try {
          const response = await authFetch(`http://localhost:3001/tipousuario/${id}`, { method: 'GET' });
          if (!response.ok) {
            throw new Error('Erro ao buscar cargo');
          }
          const data = await response.json();
          setRole(data);
        } catch (error) {
          console.error('Erro ao buscar cargo:', error);
          setErrorMessage('Erro ao buscar cargo.');
        }
      };
      fetchRole();
    }
  }, [id]);

  const handleChange = (e) => {
    setRole({ ...role, nome: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const method = id ? 'PUT' : 'POST';
      const url = `http://localhost:3001/tipousuario${id ? `/${id}` : ''}`;
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar cargo');
      }
      setSuccessMessage(`Cargo ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao salvar cargo:', error);
      setErrorMessage('Erro ao salvar cargo.');
    }
  };

  return (
    <CContainer className="mt-3">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardBody>
              <h2>{id ? 'Editar Cargo' : 'Cadastrar Cargo'}</h2>
              <CForm onSubmit={handleSubmit}>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                {successMessage && <CAlert color="success">{successMessage}</CAlert>}
                <CRow className="mb-3">
                  <CCol>
                    <CFormLabel>Nome do Cargo</CFormLabel>
                    <CFormInput
                      type="text"
                      value={role.nome}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CButton color="primary" type="submit" className="me-2">
                  <CIcon icon={cilSave} className="me-1" />
                  {id ? 'Atualizar' : 'Cadastrar'}
                </CButton>
                <CButton color="secondary" onClick={() => navigate('admin/roles')}>
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

export default CargoForm;
